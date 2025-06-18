class Resourcepack {

    constructor(minecraftVersion, resourcepackVersion) {

        this.minecraftVersion = minecraftVersion
        this.resourcepackVersion = resourcepackVersion

    }

    setResourcepackVersionAlt(resourcepackVersionAlt) {
        this.resourcepackVersionAlt = resourcepackVersionAlt
    }

    getMcmeta() {

        const output = {
            "pack": {
                "pack_format": this.minecraftVersion.pack_format,
                "description": [
                    { "text": `${this.resourcepackVersion.name} of Undying`, "color": this.resourcepackVersion.description.color },
                    { "text": "\nby Ami Amai", "color": "gray" }
                ],
                "supported_formats": {
                    "min_inclusive": this.minecraftVersion.pack_format,
                    "max_inclusive": this.minecraftVersion.max_inclusive
                }
            }
        }

        return JSON.stringify(output, null, 2)
    }

    getLanguage() {

        let output = {
            "item.minecraft.totem_of_undying": `${this.resourcepackVersion.description.lang}${this.resourcepackVersion.name} of Undying`
        }

        if (this.minecraftVersion.pack_format <= 3) {
            output = `item.totem.name=${this.resourcepackVersion.description.lang}${this.resourcepackVersion.name} of Undying`
            return output
        }
        else {
            return JSON.stringify(output, null, 2)
        }
    }

    getStructure() {

        let texture = "item/totem_of_undying.png"
        let language = ".json"
        if (this.minecraftVersion.pack_format <= 3) {
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
        return `${this.resourcepackVersion.name}-of-Undying-${this.resourcepackVersionAlt.name}_${this.minecraftVersion.name}`
    }

    getZip() {
        return `${this.getName()}.zip`
    }

}

module.exports = {
    Resourcepack: Resourcepack
}