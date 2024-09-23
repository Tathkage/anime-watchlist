const axios = require('axios');
const sleep = require('../utils/sleep');

async function fetchMediaData(accessToken, page, perPage, type) {
    const query = `
        query ($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
                media(type: ${type.toUpperCase()}) {
                    id
                    title { romaji english native }
                    description
                    coverImage { extraLarge }
                    trailer { id site }
                    duration
                    episodes
                    chapters volumes
                    startDate { year month day }
                    endDate { year month day }
                    season
                    seasonYear
                    studios { nodes { name isAnimationStudio } }
                    format
                    source(version: 3)
                    genres
                    tags { name }
                }
                pageInfo { hasNextPage }
            }
        }
    `;

    try {
        const response = await axios.post(
            'https://graphql.anilist.co',
            { query, variables: { page, perPage } },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );

        const data = response.data.data.Page;
        return { media: data.media, hasNextPage: data.pageInfo.hasNextPage };
    } 
    catch (error) {
        if (error.response && error.response.status === 429) {
            console.log('Rate limited. Waiting 20 seconds before retrying...');
            await sleep(20000);
            return { retry: true };
        } 
        else {
            throw error;
        }
    }
}

async function fetchGenreData(accessToken) {
    const query = `query { GenreCollection }`;

    try {
        const response = await axios.post(
            'https://graphql.anilist.co',
            { query },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        )

        return response.data.data.GenreCollection;
    }
    catch (error) {
        throw new Error('Error fetching genre data from AniList');
    }
}

async function fetchTagData(accessToken) {
    const query = `query { MediaTagCollection { name } }`;

    try {
        const response = await axios.post(
            'https://graphql.anilist.co',
            { query },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        )

        return response.data.data.MediaTagCollection;
    }
    catch (error) {
        throw new Error('Error fetching genre data from AniList');
    }
}

module.exports = { fetchMediaData, fetchGenreData, fetchTagData };
