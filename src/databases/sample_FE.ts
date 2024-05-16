const ALL_PERMISSION = {
    'USERS': [
        {
            method: 'POST',
            apiPath: '/api/v1/users',
            module: 'USERS',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/users',
            module: 'USERS',
        },
        {
            method: 'PATCH',
            apiPath: '/api/v1/users',
            module: 'USERS',
        },
        {
            method: 'DELETE',
            apiPath: '/api/v1/users/:id',
            module: 'USERS',
        },
    ],
    'ARTICLES': [
        {
            method: 'POST',
            apiPath: '/api/v1/articles',
            module: 'ARTICLES',
        },
        {
            method: 'PATCH',
            apiPath: '/api/v1/articles',
            module: 'ARTICLES',
        },
        {
            method: 'DELETE',
            apiPath: '/api/v1/articles/:id',
            module: 'ARTICLES',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/articles/maps/search-by-location',
            module: 'ARTICLES',
        },
    ],
    'COMMENTS': [
        {
            method: 'POST',
            apiPath: '/api/v1/comments',
            module: 'COMMENTS',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/comments/:id',
            module: 'COMMENTS',
        },
        {
            method: 'PATCH',
            apiPath: '/api/v1/comments/:id',
            module: 'COMMENTS',
        },
        {
            method: 'DELETE',
            apiPath: '/api/v1/comments/:id',
            module: 'COMMENTS',
        },
        {
            method: 'POST',
            apiPath: '/api/v1/comments/:id/reply',
            module: 'COMMENTS',
        },
        {
            method: 'PUT',
            apiPath: '/api/v1/comments/:id/reply',
            module: 'COMMENTS',
        },
        {
            method: 'DELETE',
            apiPath: '/api/v1/comments/:id/reply/:reply_id',
            module: 'COMMENTS',
        },
    ],
    'FILES': [
        {
            method: 'POST',
            apiPath: '/api/v1/files/upload',
            module: 'FILES',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/files',
            module: 'FILES',
        },
        {
            method: 'REMOVE',
            apiPath: '/api/v1/files/:name',
            module: 'FILES',
        },
    ],
    'CATEGORIES': [
        {
            method: 'POST',
            apiPath: '/api/v1/categories',
            module: 'CATEGORIES',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/categories/:id',
            module: 'CATEGORIES',
        },
        {
            method: 'PATCH',
            apiPath: '/api/v1/categories/:id',
            module: 'CATEGORIES',
        },
        {
            method: 'DELETE',
            apiPath: '/api/v1/categories/:id',
            module: 'CATEGORIES',
        },
    ],
    'FOLLOW': [
        {
            method: 'POST',
            apiPath: '/api/v1/follow',
            module: 'FOLLOW',
        },
        {
            method: 'PUT',
            apiPath: '/api/v1/unFollow',
            module: 'FOLLOW',
        },
    ],
    'VERIFICATIONS': [
        {
            method: 'POST',
            apiPath: '/api/v1/verifications',
            module: 'VERIFICATIONS',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/verifications',
            module: 'VERIFICATIONS',
        },
        {
            method: 'PATCH',
            apiPath: '/api/v1/verifications',
            module: 'VERIFICATIONS',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/verifications/:id',
            module: 'VERIFICATIONS',
        },
    ],
    'LANDLORD-REQUEST': [
        {
            method: 'POST',
            apiPath: '/api/v1/landlord-request',
            module: 'LANDLORD-REQUEST',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/landlord-request',
            module: 'LANDLORD-REQUEST',
        },
        {
            method: 'PATCH',
            apiPath: '/api/v1/landlord-request',
            module: 'LANDLORD-REQUEST',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/landlord-request/:id',
            module: 'LANDLORD-REQUEST',
        },
    ],
    'PERMISSIONS': [
        {
            method: 'POST',
            apiPath: '/api/v1/permissions',
            module: 'PERMISSIONS',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/permissions',
            module: 'PERMISSIONS',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/permissions/:id',
            module: 'PERMISSIONS',
        },
        {
            method: 'PATCH',
            apiPath: '/api/v1/permissions/:id',
            module: 'PERMISSIONS',
        },
        {
            method: 'DELETE',
            apiPath: '/api/v1/permissions/:id',
            module: 'PERMISSIONS',
        },
    ],
    'ROLES': [
        {
            method: 'POST',
            apiPath: '/api/v1/roles',
            module: 'ROLES',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/roles',
            module: 'ROLES',
        },
        {
            method: 'GET',
            apiPath: '/api/v1/roles/:id',
            module: 'ROLES',
        },
        {
            method: 'PATCH',
            apiPath: '/api/v1/roles/:id',
            module: 'ROLES',
        },
        {
            method: 'DELETE',
            apiPath: '/api/v1/roles/:id',
            module: 'ROLES',
        },
    ],
};
