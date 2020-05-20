const ProductIcons = {
    AUDIO: 'audio',
    IMAGE: 'image',
    INTERACTIVE: 'interactive',
    TEXT: 'text',
    VIDEO: 'video',
}

let allowedFileTypes = [
    35, /* 2mb mp4 */
    34, /* image */
]

const FileTypes = {
    PDF_1: 8,
    LEARNING_GUIDE: 6,
    PDF_2: 20,
    MP3: 16,
    MP4: 34,
    MP4_2MB: 35,
    HTM: 32,
    // VTF:  52, /* vtt */
    ZIP: 43,
    IMAGE: 36,
    MEDIUM_IMAGE: 37,
    LARGE_IMAGE: 38,
}

const AllowedFileTypes = {
    [ProductIcons.AUDIO]: [FileTypes.MP3],
    [ProductIcons.TEXT]: [FileTypes.PDF_1, FileTypes.PDF_2, FileTypes.HTM, FileTypes.LEARNING_GUIDE],
    [ProductIcons.INTERACTIVE]: [FileTypes.ZIP],
    [ProductIcons.IMAGE]: [FileTypes.LARGE_IMAGE, FileTypes.MEDIUM_IMAGE, FileTypes.IMAGE],
    [ProductIcons.VIDEO]: [FileTypes.MP4_2MB, FileTypes.MP4],
}

export const EKBTools = {
    methods: {
        getDiscoveryProductInfo(productID, cb) {
            this.api.get(`${this.api.apiv3Route}discovery/asset/${productID}`, (res) => {
                cb(res)
            })
        },

        conformEKBAsset(asset) {
            if (asset.media_files) asset.productJSON = this.generateMockProductJSONForEKBProduct(asset)

            let assetId = asset.id || asset.guid
            asset.productSKU = assetId
            asset.productID = assetId
            asset.productName = asset.title
            asset.downloadAllowed = true
            return asset
        },

        conformSearchResultsRes(res) {
            res.assets = res.assets.map(asset => this.conformEKBAsset(asset))
            return res
        },

        getEKBProductTypeIcon(product) {
            let type = product.type
            let possibleTypeIcons = Object.values(ProductIcons)

            if (product.group) {
                if (possibleTypeIcons.includes(product.group)) return product.group
            }

            if (typeof(type) === 'string') {
                if (possibleTypeIcons.includes(type.toLowerCase())) return type.toLowerCase()
            }

            if (typeof(type) === 'object' && type.name) {
                if (type.name.includes('Introduction') || type.name.includes('Video')) return ProductIcons.VIDEO
                if (type.name.includes('Image')) return ProductIcons.IMAGE
                if (type.name.includes('Audio')) return ProductIcons.AUDIO
                if (type.name.includes('Interactive')) return ProductIcons.INTERACTIVE
            }

            return ProductIcons.TEXT
        },

        generateMockProductJSONForEKBProduct(product) {
            const mediaType = this.getEKBProductTypeIcon(product);
            const allowedFile = product.media_files.find(file => {
                return AllowedFileTypes[mediaType].includes(file.format_id);
            })

            kw(allowedFile)

            let productJSON = {}

            let fileExtensionREGEX = /(?:\.([^.]+))?$/
            let fileExtension = fileExtensionREGEX.exec(allowedFile.file_name)[1]
            let productType

            console.log('fileExtension after regex', fileExtension)

            switch(fileExtension) {
                case 'pdf':
                    productType = 'pdf'
                    break;
                case 'zip':
                    productType = 'zip';
                    break;
                case 'jpg':
                    productType = 'image';
                    break;
                case 'mp3':
                    productType = 'audio'
                    break;
                case 'mp4':
                    productType = 'video'
                    break;
                default:
                    productType = 'text'
            }

            productJSON[productType] = []

            kw('allowed file is', allowedFile)

            productJSON[productType].push({
                fileName: allowedFile.file_name,
                displayName: allowedFile.title,
                productSKU: allowedFile.id,
                type: productType,
                uri: allowedFile.url,
                streamingURL: allowedFile.streamingURL
            })

            console.log('mocked productJSON = ', productJSON)
            return productJSON
        },

        sceneContext(fullPath) {
            if (fullPath.includes('/searchResults')) {
                return '/app/search';
            }
            else if (fullPath.includes('/downloads')) {
                return '/app/downloads';
            }
            else if (fullPath.includes('/curriculumConnect')) {
                return '/app/curriculumconnect';
            }
            else if (fullPath.includes('/webEdTV')) {
                return '/app/webed';
            }
        }
    },
}
