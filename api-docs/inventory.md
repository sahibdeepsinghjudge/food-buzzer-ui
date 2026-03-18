"/api/inventory/update-stock/{itemId}": {
"put": {
"tags": [
"inventory-controller"
],
"operationId": "updateInventoryStock",
"parameters": [
{
"name": "itemId",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
},
{
"name": "X-User-Id",
"in": "header",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/UpdateInventoryStockRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"type": "object"
}
}
}
}
}
}
}

"/api/inventory/add": {
"post": {
"tags": [
"inventory-controller"
],
"operationId": "addInventoryItem",
"parameters": [
{
"name": "X-User-Id",
"in": "header",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/CreateInventoryMaterialRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"type": "object"
}
}
}
}
}
}
},

"/api/inventory/search": {
"get": {
"tags": [
"inventory-controller"
],
"operationId": "searchByName",
"parameters": [
{
"name": "X-User-Id",
"in": "header",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
},
{
"name": "name",
"in": "query",
"required": true,
"schema": {
"type": "string"
}
}
],
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"type": "object"
}
}
}
}
}
}
},
"/api/inventory/low-stock": {
"get": {
"tags": [
"inventory-controller"
],
"operationId": "getLowStockItems",
"parameters": [
{
"name": "X-User-Id",
"in": "header",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"type": "object"
}
}
}
}
}
}
},
"/api/inventory/all": {
"get": {
"tags": [
"inventory-controller"
],
"operationId": "getAllInventoryItems",
"parameters": [
{
"name": "X-User-Id",
"in": "header",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"type": "object"
}
}
}
}
}
}
},
"/api/inventory/delete/{itemId}": {
"delete": {
"tags": [
"inventory-controller"
],
"operationId": "deleteInventoryItem",
"parameters": [
{
"name": "itemId",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
},
{
"name": "X-User-Id",
"in": "header",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"type": "object"
}
}
}
}
}
}
}
},

SCHEMAS

"UpdateInventoryStockRequest": {
"type": "object",
"properties": {
"name": {
"type": "string"
},
"sku": {
"type": "string"
},
"category": {
"type": "string"
},
"unit": {
"type": "string"
},
"currentStock": {
"type": "number",
"format": "double"
},
"reorderLevel": {
"type": "number",
"format": "double"
},
"costPerUnit": {
"type": "number"
},
"isActive": {
"type": "boolean"
}
}
},

"CreateInventoryMaterialRequest": {
"type": "object",
"properties": {
"name": {
"type": "string"
},
"sku": {
"type": "string"
},
"category": {
"type": "string"
},
"unit": {
"type": "string"
},
"currentStock": {
"type": "number",
"format": "double"
},
"reorderLevel": {
"type": "number",
"format": "double"
},
"costPerUnit": {
"type": "number"
}
}
},
