const { seasonMap, formatMap, sourceMap, relationMap } = require('../db/dbConfig');
const cleanString = require('../utils/cleanString');

function isValidDate(year, month, day) {
    if (!year || !month || !day) {
        return false;
    }

    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

function transformMediaData(mediaList, type) {
    return mediaList.map(media => {
        media.season = seasonMap[media.season] || media.season;
        media.format = formatMap[media.format] || media.format;
        media.source = sourceMap[media.source] || media.source;

        const producers = media.studios?.nodes
            .filter(studio => !studio.isAnimationStudio)  
            .map(studio => studio.name) || [];

        const startDate = media.startDate && isValidDate(media.startDate.year, media.startDate.month, media.startDate.day)
            ? `${media.startDate.year}-${media.startDate.month}-${media.startDate.day}`
            : null;

        const endDate = media.endDate && isValidDate(media.endDate.year, media.endDate.month, media.endDate.day)
            ? `${media.endDate.year}-${media.endDate.month}-${media.endDate.day}`
            : null;

        return {
            [`${type}_id`]: media.id,
            romaji_name: media.title?.romaji ? cleanString(media.title.romaji) : null,
            english_name: media.title?.english ? cleanString(media.title.english) : null,
            native_name: media.title?.native ? cleanString(media.title.native) : null,
            description: media.description ? cleanString(media.description) : null,
            cover_image: media.coverImage?.extraLarge || null,
            trailer_url: media.trailer?.site ? `https://www.${media.trailer.site}.com/watch?v=${media.trailer.id}` : null,
            episode_duration: type === 'anime' ? media.duration || null : null,
            episode_count: type === 'anime' ? media.episodes || null : null,
            chapter_count: type === 'manga' ? media.chapters || null : null,
            volume_count: type === 'manga' ? media.volumes || null : null,
            start_date: startDate,
            end_date: endDate,
            year: media.seasonYear || null,
            season: media.season || null,
            animation_studio: media.studios?.nodes[0]?.isAnimationStudio ? media.studios.nodes[0].name : null,
            producers: producers.length > 0 ? producers : null,
            format: media.format || null,
            source: media.source || null
        };
    });
}

function transformAttributeData(attributeList, type) {
    let nextId = 1;
    return attributeList.map(attribute => ({
        [`${type}_id`]: nextId++,
        name: attribute.name || attribute
    }));
}

function transformMediaAttributeData(mediaList, mediaType, attributeMap, attributeType) {
    const singularAttribute = attributeType.slice(0, -1);
    const mediaAttributeData = [];

    mediaList.forEach(media => {
        media[attributeType].forEach(attribute => {
            const attributeId = attributeMap[attribute.name || attribute];
            mediaAttributeData.push({
                [`${mediaType}_id`]: media.id,
                [`${singularAttribute}_id`]: attributeId
            });
        });
    });
    return mediaAttributeData;
}

function transformRelatedMediaData(mediaList, mediaType) {
    const relatedMediaData = [];
    mediaList.forEach(media => {
        media.relations.edges.forEach(relation => {
            relation.relationType = relationMap[relation.relationType] || relation.relationType;
            relatedMediaData.push({
                anime_id: mediaType === 'anime' ? media.id: null,
                manga_id: mediaType === 'manga' ? media.id : null,
                related_anime_id: relation.node.type === 'ANIME' ? relation.node.id : null,
                related_manga_id: relation.node.type === 'MANGA' ? relation.node.id : null,
                relation_type: relation.relationType
            })
        })
    });
    return relatedMediaData;
}

module.exports = { transformMediaData, transformAttributeData, transformMediaAttributeData, transformRelatedMediaData };