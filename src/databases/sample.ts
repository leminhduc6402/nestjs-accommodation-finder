export const ADMIN = 'ADMIN';
export const USER = 'USER';
export const INIT_PERMISSIONS = [
    //USER
    {
        "_id": "648ab415f4328bd3153ee211",
        "name": "Create a new user",
        "apiPath": "/api/v1/users",
        "method": "POST",
        "module": "USERS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "__v": 0,
    },
    {
        "_id": "648ab436f4328bd3153ee216",
        "name": "Get all user with paginate",
        "apiPath": "/api/v1/users",
        "module": "USERS",
        "method": "GET",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "__v": 0,
    },
    {
        "_id": "648ab4d5f4328bd3153ee21b",
        "name": "Update a user",
        "apiPath": "/api/v1/users",
        "method": "PATCH",
        "module": "USERS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ab4ebf4328bd3153ee220",
        "name": "Remove a user",
        "apiPath": "/api/v1/users/:id",
        "method": "DELETE",
        "module": "USERS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    //ARTICLE
    {
        "_id": "648ab5a8072f2a2ef910638d",
        "name": "Create an article",
        "apiPath": "/api/v1/articles",
        "method": "POST",
        "module": "ARTICLES",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ab6d3fa16b294212e4033",
        "name": "Update an article",
        "apiPath": "/api/v1/articles",
        "method": "PATCH",
        "module": "ARTICLES",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ab6e7fa16b294212e4038",
        "name": "Remove an article",
        "apiPath": "/api/v1/articles/:id",
        "method": "DELETE",
        "module": "ARTICLES",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ab6fdfa16b294212e403d",
        "name": "Search by location",
        "apiPath": "/api/v1/articles/maps/search-by-location",
        "method": "GET",
        "module": "ARTICLES",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    //COMMENT
    {
        "_id": "648ab719fa16b294212e4042",
        "name": "Create a comment",
        "apiPath": "/api/v1/comments",
        "method": "POST",
        "module": "COMMENTS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ab728fa16b294212e4047",
        "name": "Get all comment by article id",
        "apiPath": "/api/v1/comments/:id",
        "method": "GET",
        "module": "COMMENTS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ab750fa16b294212e404c",
        "name": "Update a comment",
        "apiPath": "/api/v1/comments/:id",
        "method": "PATCH",
        "module": "COMMENTS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ad488dafdb9754f40b846",
        "name": "Remove a comment by id",
        "apiPath": "/api/v1/comments/:id",
        "method": "DELETE",
        "module": "COMMENTS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ad499dafdb9754f40b84b",
        "name": "Create a reply",
        "apiPath": "/api/v1/comments/:id/reply",
        "method": "POST",
        "module": "COMMENTS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ad4a6dafdb9754f40b850",
        "name": "Update a reply",
        "apiPath": "/api/v1/comments/:id/reply",
        "method": "PUT",
        "module": "COMMENTS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ad4ccdafdb9754f40b859",
        "name": "Remove a reply",
        "apiPath": "/api/v1/comments/:id/reply/:reply_id",
        "method": "DELETE",
        "module": "COMMENTS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    //FILE
    {
        "_id": "6663f709bf420f28cd067897",
        "name": "Upload base64 file",
        "apiPath": "/api/v1/files/uploadBase64",
        "method": "POST",
        "module": "FILES",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
        {
        "_id": "648ad4d9dafdb9754f40b85e",
        "name": "Upload single file",
        "apiPath": "/api/v1/files/upload",
        "method": "POST",
        "module": "FILES",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ad4fedafdb9754f40b863",
        "name": "Get all file with paginate",
        "apiPath": "/api/v1/files",
        "method": "GET",
        "module": "FILES",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ad511dafdb9754f40b868",
        "name": "Remove a file",
        "apiPath": "/api/v1/files/:name",
        "method": "REMOVE",
        "module": "FILES",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    //CATEGORY
    {
        "_id": "648ad522dafdb9754f40b86d",
        "name": "Create a category",
        "apiPath": "/api/v1/categories",
        "method": "POST",
        "module": "CATEGORIES",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ad53bdafdb9754f40b872",
        "name": "Get category by id",
        "apiPath": "/api/v1/categories/:id",
        "method": "GET",
        "module": "CATEGORIES",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ad555dafdb9754f40b877",
        "name": "Update a category",
        "apiPath": "/api/v1/categories/:id",
        "method": "PATCH",
        "module": "CATEGORIES",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648ad56ddafdb9754f40b87c",
        "name": "Remove a category",
        "apiPath": "/api/v1/categories/:id",
        "method": "DELETE",
        "module": "CATEGORIES",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    //FOLLOW
    {
        "_id": "64871701c7573fac797f83ea",
        "name": "Follow a user",
        "apiPath": "/api/v1/follow",
        "method": "POST",
        "module": "FOLLOW",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "64871777c7573fac797f83f6",
        "name": "Unfollow a user",
        "apiPath": "/api/v1/unFollow",
        "method": "PUT",
        "module": "FOLLOW",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    //VERIFICATION
    {
        "_id": "648717bdc7573fac797f83fa",
        "name": "Create a verification",
        "apiPath": "/api/v1/verifications",
        "method": "POST",
        "module": "VERIFICATIONS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648717fac7573fac797f83fe",
        "name": "Get all verification by article id",
        "apiPath": "/api/v1/verifications",
        "method": "GET",
        "module": "VERIFICATIONS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "64871834c7573fac797f8402",
        "name": "Update a verification",
        "apiPath": "/api/v1/verifications",
        "method": "PATCH",
        "module": "VERIFICATIONS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "64871862c7573fac797f8406",
        "name": "Get a verification by id",
        "apiPath": "/api/v1/verifications/:id",
        "method": "GET",
        "module": "VERIFICATIONS",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    //LANDLORD-REQUEST
    {
        "_id": "64871896c7573fac797f840a",
        "name": "Create a request",
        "apiPath": "/api/v1/landlord-request",
        "method": "POST",
        "module": "LANDLORD-REQUEST",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648718ccc7573fac797f840e",
        "name": "Get all request by article id",
        "apiPath": "/api/v1/landlord-request",
        "method": "GET",
        "module": "LANDLORD-REQUEST",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "6487197ec7573fac797f8414",
        "name": "Update a request",
        "apiPath": "/api/v1/landlord-request",
        "method": "PATCH",
        "module": "LANDLORD-REQUEST",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    {
        "_id": "648719bdc7573fac797f8418",
        "name": "Get a request by id",
        "apiPath": "/api/v1/landlord-request/:id",
        "method": "GET",
        "module": "LANDLORD-REQUEST",
        "isDelete": false,
        "deletedAt": null,
        "createdAt": "2024-04-24T14:11:16.243Z",
        "createdBy": "662ded47fadbff331f7d9db2",
        "updatedAt": "2024-04-24T14:11:16.243Z",
        "updatedBy": "662ded47fadbff331f7d9db2",
        "__v": 0,
    },
    // PERMISSION
    {
        "_id": '648ad59adafdb9754f40b881',
        "name": 'Create a permission',
        "apiPath": '/api/v1/permissions',
        "method": 'POST',
        "module": 'PERMISSIONS',
        "createdBy": "662ded47fadbff331f7d9db2",
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": '2024-04-24T14:11:16.243Z',
        "updatedAt": '2024-04-24T14:11:16.243Z',
        "__v": 0,
    },
    {
        "_id": '648ad5aedafdb9754f40b886',
        "name": 'Fetch Permission with paginate',
        "apiPath": '/api/v1/permissions',
        "method": 'GET',
        "module": 'PERMISSIONS',
        "createdBy": "662ded47fadbff331f7d9db2",
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": '2024-04-24T14:11:16.243Z',
        "updatedAt": '2024-04-24T14:11:16.243Z',
        "__v": 0,
    },
    {
        "_id": '648ad5c5dafdb9754f40b88b',
        "name": 'Fetch permission by id',
        "apiPath": '/api/v1/permissions/:id',
        "method": 'GET',
        "module": 'PERMISSIONS',
        "createdBy": '662ded47fadbff331f7d9db2',
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": '2024-04-24T14:11:16.243Z',
        "updatedAt": '2024-04-24T14:11:16.243Z',
        "__v": 0,
    },
    {
        "_id": '648ad5d4dafdb9754f40b890',
        "name": 'Update a permission',
        "apiPath": '/api/v1/permissions/:id',
        "method": 'PATCH',
        "module": 'PERMISSIONS',
        "createdBy":'662ded47fadbff331f7d9db2',
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": '2024-04-24T14:11:16.243Z',
        "updatedAt": '2024-04-24T14:11:16.243Z',
        "__v": 0,
    },
    {
        "_id": '648ad5ebdafdb9754f40b895',
        "name": 'Delete a permission',
        "apiPath": '/api/v1/permissions/:id',
        "method": 'DELETE',
        "module": 'PERMISSIONS',
        "createdBy": '662ded47fadbff331f7d9db2',
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": '2024-04-24T14:11:16.243Z',
        "updatedAt": '2024-04-24T14:11:16.243Z',
        "__v": 0,
    },
    //ROLE
    {
        "_id": '648ad613dafdb9754f40b89a',
        "name": 'Create Role',
        "apiPath": '/api/v1/roles',
        "method": 'POST',
        "module": 'ROLES',
        "createdBy": '662ded47fadbff331f7d9db2',
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": '2024-04-24T14:11:16.243Z',
        "updatedAt": '2024-04-24T14:11:16.243Z',
        "__v": 0,
    },
    {
        "_id": '648ad622dafdb9754f40b89f',
        "name": 'Fetch roles with paginate',
        "apiPath": '/api/v1/roles',
        "method": 'GET',
        "module": 'ROLES',
        "createdBy": '662ded47fadbff331f7d9db2',
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": '2024-04-24T14:11:16.243Z',
        "updatedAt": '2024-04-24T14:11:16.243Z',
        "__v": 0,
    },
    {
        "_id": '648ad630dafdb9754f40b8a6',
        "name": 'Fetch role by id',
        "apiPath": '/api/v1/roles/:id',
        "method": 'GET',
        "module": 'ROLES',
        "createdBy": '662ded47fadbff331f7d9db2',
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": '2024-04-24T14:11:16.243Z',
        "updatedAt": '2024-04-24T14:11:16.243Z',
        "__v": 0,
    },
    {
        "_id": '648ad640dafdb9754f40b8ab',
        "name": 'Update Role',
        "apiPath": '/api/v1/roles/:id',
        "method": 'PATCH',
        "module": 'ROLES',
        "createdBy": '662ded47fadbff331f7d9db2',
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": '2024-04-24T14:11:16.243Z',
        "updatedAt": '2024-04-24T14:11:16.243Z',
        "__v": 0,
    },
    {
        "_id": '648ad650dafdb9754f40b8b0',
        "name": 'Delete a Role',
        "apiPath": '/api/v1/roles/:id',
        "method": 'DELETE',
        "module": 'ROLES',
        "createdBy": '662ded47fadbff331f7d9db2',
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": '2024-04-24T14:11:16.243Z',
        "updatedAt": '2024-04-24T14:11:16.243Z',
        "__v": 0,
    },
]