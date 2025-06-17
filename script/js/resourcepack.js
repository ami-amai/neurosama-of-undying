class Resourcepack {

    constructor(minecraftVersion, resourcepackVersion) {
        this.minecraftVersion = minecraftVersion
        this.minecraftVersionId = minecraftVersion.id
        this.minecraftVersionName = minecraftVersion.name

        this.resourcepackVersion = resourcepackVersion
        this.resourcepackVersionName = resourcepackVersion.name
        this.resourcepackVersionColorDescription = resourcepackVersion.color.description
        this.resourcepackVersionColorLanguage = resourcepackVersion.color.lang
    }

    setResourcepackVersionAlt(resourcepackVersionAlt) {
        this.resourcepackVersionAlt = resourcepackVersionAlt
        this.resourcepackVersionAltName = resourcepackVersionAlt.name
        this.resourcepackVersionAltFile = resourcepackVersionAlt.file
    }

    // Generate Files
    getMcmeta() {
        const output = {
            "pack": {
                "pack_format": this.minecraftVersionId,
                "description": [
                    { "text": `${this.resourcepackVersionName} of Undying`, "color": this.resourcepackVersionColorDescription },
                    { "text": "\nby Ami Amai", "color": "gray" }
                ]
            }
        }

        return JSON.stringify(output, null, 2)
    }

    getLanguage() {

        let output = {
            "item.minecraft.totem_of_undying": `${this.resourcepackVersionColorLanguage}${this.resourcepackVersionName} of Undying`
        }

        if (this.minecraftVersionId <= 3) {
            output = `item.totem.name=${this.resourcepackVersionColorLanguage}${this.resourcepackVersionName} of Undying`
            return output
        }
        else {
            return JSON.stringify(output, null, 2)
        }
    }

    // Paths and Folders

    getStructure() {

        let texture = "item/totem_of_undying.png"
        let language = ".json"
        if (this.minecraftVersionId <= 3) {
            texture = "items/totem.png"
            language = ".lang"
        }

        return {
            "mcmeta": "pack.mcmeta",
            "icon": "pack.png",
            "texture": `assets/minecraft/textures/${texture}`,
            "language": `assets/minecraft/lang/en_us${language}`
        }
    }

    getName() {
        return `${this.resourcepackVersionName}-of-Undying-${this.resourcepackVersionAltName}_${this.minecraftVersionName}`
    }

    getDir() {
        return `${this.getName()}/`
    }

}

module.exports = {
    Resourcepack: Resourcepack
}