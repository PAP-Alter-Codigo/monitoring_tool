const Article = require('../models/article.js');
const Location = require('../models/location.js');
const Tag = require('../models/tag.js');
const { isValidDate } = require('../utils/validators');

const isValidSourceName = (name) => typeof name === 'string' && name.trim().length > 0;
const isValidPaywall = (paywall) => typeof paywall === 'boolean';
const isValidHeadline = (headline) => typeof headline === 'string' && headline.trim().length > 0;
const isValidUrl = (url) => typeof url === 'string' && url.trim().length > 0 && /^https?:\/\//i.test(url.trim());
const isValidAuthor = (author) => typeof author === 'string';
const isValidCoverageLevel = (coverageLevel) => typeof coverageLevel === 'string';

const isValidActorsMentioned = (actors) => Array.isArray(actors);

const isValidTags = (tags) =>
    Array.isArray(tags) &&
    tags.length > 0 &&
    tags.every(id => typeof id === 'string' && id.trim().length > 0);

const isValidLocations = (location) =>
    Array.isArray(location) &&
    location.every(id => typeof id === 'string' && id.trim().length > 0);


const validateArticlePayload = (article) => {
    if (!article) return 'Article payload is missing.';
    if (!isValidDate(article.publicationDate)) return 'Invalid publicationDate. Format must be DD/MM/YYYY.';
    if (!isValidSourceName(article.sourceName)) return 'Invalid or empty sourceName.';
    if (!isValidPaywall(article.paywall)) return 'Invalid paywall. Must be a boolean.';
    if (!isValidHeadline(article.headline)) return 'Invalid or empty headline.';
    if (!isValidUrl(article.url)) return 'Invalid or empty url.';
    if (!isValidAuthor(article.author)) return 'Invalid author.';
    if (!isValidCoverageLevel(article.coverageLevel)) return 'Invalid coverageLevel.';
    if (!isValidActorsMentioned(article.actorsMentioned)) return 'Invalid actorsMentioned.';
    if (!isValidTags(article.tags)) return 'Invalid tags. Must be a non-empty array of tag IDs.';
    if (article.location !== undefined && !isValidLocations(article.location)) return 'Invalid location.';
    return null;
};

const populateLocations = async (article) => {
    const plain = JSON.parse(JSON.stringify(article));
    const locationIds = Array.isArray(plain.location) ? plain.location : [];
    const locations = await Promise.all(
        locationIds.map(id => Location.get({ id }).catch(() => null))
    );
    plain.location = locations.filter(Boolean);
    return plain;
};

const parseDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return 0;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return 0;
    const [day, month, year] = parts;
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime() || 0;
};

const getAll = async (req, res) => {
    try {
        const articles = await Article.scan().exec();

        // Collect only unique location IDs across all articles to avoid N+1 queries
        const uniqueLocIds = new Set();
        for (const a of articles) {
            const locList = a.location || [];
            if (Array.isArray(locList)) {
                for (const id of locList) {
                    if (id) uniqueLocIds.add(String(id));
                }
            }
        }

        // Fetch each unique location only once (only ~16 queries instead of 1,300+)
        const locationMap = new Map();
        await Promise.all(
            Array.from(uniqueLocIds).map(async (id) => {
                try {
                    const loc = await Location.get({ id });
                    if (loc) {
                        locationMap.set(id, { id: loc.id, name: loc.name, geolocation: loc.geolocation });
                    }
                } catch {
                    // ignore individual fetch errors
                }
            })
        );

        const populated = Array.from(articles).map(article => {
            const plain = JSON.parse(JSON.stringify(article));
            const locationIds = Array.isArray(plain.location) ? plain.location : [];
            plain.location = locationIds.map(id => locationMap.get(String(id))).filter(Boolean);
            return plain;
        });

        populated.sort((a, b) => parseDate(b.publicationDate) - parseDate(a.publicationDate));
        res.status(200).json(populated);
    } catch (error) {
        console.error('[getAll] Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const article = await Article.get({ id: req.params.id });
        if (!article) {
            return res.status(404).json({ error: `Article with ID ${req.params.id} not found.` });
        }
        const populated = await populateLocations(article);
        res.status(200).json(populated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const create = async (req, res) => {
    try {
        const article = req.body;

        const validationError = validateArticlePayload(article);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const exists = await Article.query('url').eq(article.url.trim()).exec();
        if (exists && exists.length > 0) {
            return res.status(409).json({ error: `Article with URL ${article.url} already exists.` });
        }

        const newArticle = new Article({
            publicationDate: article.publicationDate,
            sourceName: article.sourceName.trim(),
            paywall: typeof article.paywall === 'boolean' ? article.paywall : false,
            headline: article.headline.trim(),
            url: article.url.trim(),
            author: (article.author || '').trim(),
            coverageLevel: article.coverageLevel || '',
            actorsMentioned: article.actorsMentioned,
            tags: article.tags,
            location: article.location || [],
            origin: 'user',
            ...(article.summary !== undefined && { summary: article.summary }),
            ...((article.relevance ?? article.relevanceLevel ?? article.relevance_level) !== undefined && {
                relevance: article.relevance ?? article.relevanceLevel ?? article.relevance_level
            }),
            ...((article.why ?? article.whyItMatters ?? article.why_it_matters) !== undefined && {
                why: article.why ?? article.whyItMatters ?? article.why_it_matters
            }),
        });

        await newArticle.save();
        res.status(201).json({ message: 'Article successfully created.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { publicationDate, sourceName, paywall, headline, url, author, coverageLevel, actorsMentioned, tags, location, summary, relevance, why } = req.body;

    try {
        const existing = await Article.get({ id });
        if (!existing) {
            return res.status(404).json({ error: `Article with ID ${id} not found.` });
        }

        const updateData = {}

        if (publicationDate) {
            if (!isValidDate(publicationDate)) {
                return res.status(400).json({ error: 'Invalid publicationDate.' });
            }
            updateData.publicationDate = publicationDate;
        }

        if (sourceName) {
            if (!isValidSourceName(sourceName)) {
                return res.status(400).json({ error: 'Invalid or empty sourceName.' });
            }
            updateData.sourceName = sourceName.trim();
        }

        if (paywall !== undefined) {
            if (!isValidPaywall(paywall)) {
                return res.status(400).json({ error: 'Invalid paywall.' });
            }
            updateData.paywall = paywall;
        }

        if (headline) {
            if (!isValidHeadline(headline)) {
                return res.status(400).json({ error: 'Invalid or empty headline.' });
            }
            updateData.headline = headline.trim();
        }

        if (url) {
            if (!isValidUrl(url)) {
                return res.status(400).json({ error: 'Invalid or empty url.' });
            }
            updateData.url = url.trim();
        }

        if (author !== undefined) {
            if (!isValidAuthor(author)) {
                return res.status(400).json({ error: 'Invalid author.' });
            }
            updateData.author = author.trim();
        }

        if (coverageLevel) {
            if (!isValidCoverageLevel(coverageLevel)) {
                return res.status(400).json({ error: 'Invalid coverageLevel.' });
            }
            updateData.coverageLevel = coverageLevel;
        }

        if (actorsMentioned) {
            if (!isValidActorsMentioned(actorsMentioned)) {
                return res.status(400).json({ error: 'Invalid actorsMentioned.' });
            }
            updateData.actorsMentioned = actorsMentioned;
        }

        if (tags) {
            if (!isValidTags(tags)) {
                return res.status(400).json({ error: 'Invalid tags. Must be a non-empty array of tag IDs.' });
            }
            updateData.tags = tags;
        }

        if (location !== undefined) {
            if (!isValidLocations(location)) {
                return res.status(400).json({ error: 'Invalid location. Must be an array of strings.' });
            }
            updateData.location = location;
        }

        if (summary !== undefined) {
            if (typeof summary !== 'string') {
                return res.status(400).json({ error: 'Invalid summary.' });
            }
            updateData.summary = summary;
        }

        if (relevance !== undefined) {
            if (typeof relevance !== 'string') {
                return res.status(400).json({ error: 'Invalid relevance.' });
            }
            updateData.relevance = relevance;
        }

        if (why !== undefined) {
            if (typeof why !== 'string') {
                return res.status(400).json({ error: 'Invalid why.' });
            }
            updateData.why = why;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No valid fields provided for update.' });
        }

        await Article.update({ id }, updateData);
        res.status(200).json({ message: 'Article successfully updated.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await Article.get({ id });
        if (!existing) {
            return res.status(404).json({ error: `Article with ID ${id} not found.` });
        }

        await Article.delete({ id });
        res.status(200).json({ message: 'Article successfully deleted.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const formatName = (name) => (name || '').trim().toUpperCase().replace(/ /g, '_');

const resolveLocationIds = async (locationNames) => {
    const validNames = locationNames.filter(loc => loc && typeof loc.name === 'string' && loc.name.trim());
    const results = await Promise.all(
        validNames.map(({ name }) =>
            Location.scan('name').eq(formatName(name)).exec()
        )
    );
    validNames.forEach(({ name }, i) => {
        if (!results[i] || results[i].length === 0) {
            console.warn(`[muninn] Location not found in DB — skipped: "${name}" (normalized: "${formatName(name)}")`);
        }
    });
    return results.flat().map(l => l.id);
};

const resolveTagIds = async (tagNames) => {
    const validNames = tagNames.filter(t => t && typeof t.name === 'string' && t.name.trim());
    const results = await Promise.all(
        validNames.map(({ name }) =>
            Tag.scan('name').eq(formatName(name)).exec()
        )
    );
    validNames.forEach(({ name }, i) => {
        if (!results[i] || results[i].length === 0) {
            console.warn(`[muninn] Tag not found in DB — skipped: "${name}" (normalized: "${formatName(name)}")`);
        }
    });
    return results.flat().map(t => t.id);
};

const validateMunninPayload = (article) => {
    if (!article) return 'Article payload is missing.';
    if (!isValidDate(article.publicationDate)) return 'Invalid publicationDate. Format must be DD/MM/YYYY.';
    if (!isValidSourceName(article.sourceName)) return 'Invalid or empty sourceName.';
    if (!isValidHeadline(article.headline)) return 'Invalid or empty headline.';
    if (!isValidUrl(article.url)) return 'Invalid or empty url.';
    if (!Array.isArray(article.location)) return 'Invalid location. Must be an array of { name } objects.';
    if (!Array.isArray(article.tags) || article.tags.length === 0) return 'Invalid tags. Must be a non-empty array of { name } objects.';
    return null;
};

const createFromMunnin = async (req, res) => {
    try {
        const article = req.body;

        const validationError = validateMunninPayload(article);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const exists = await Article.query('url').eq(article.url.trim()).exec();
        if (exists && exists.length > 0) {
            return res.status(409).json({ error: `Article with URL ${article.url} already exists.` });
        }

        const [locationIds, tagIds] = await Promise.all([
            resolveLocationIds(article.location),
            resolveTagIds(article.tags),
        ]);

        if (!tagIds || tagIds.length === 0) {
            return res.status(400).json({ error: 'None of the provided tags could be resolved to existing tags in the database.' });
        }

        const newArticle = new Article({
            publicationDate: article.publicationDate,
            sourceName: article.sourceName.trim(),
            paywall: false,
            headline: article.headline.trim(),
            url: article.url.trim(),
            author: (article.author || '').trim(),
            coverageLevel: article.coverageLevel || '',
            actorsMentioned: [],
            tags: tagIds,
            location: locationIds || [],
            origin: 'muninn',
            ...(article.summary !== undefined && { summary: article.summary }),
            ...((article.relevance ?? article.relevanceLevel ?? article.relevance_level) !== undefined && {
                relevance: article.relevance ?? article.relevanceLevel ?? article.relevance_level
            }),
            ...((article.why ?? article.whyItMatters ?? article.why_it_matters) !== undefined && {
                why: article.why ?? article.whyItMatters ?? article.why_it_matters
            }),
        });

        await newArticle.save();
        res.status(201).json({ message: 'Article successfully created.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    createFromMunnin,
};