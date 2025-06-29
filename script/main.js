// Libs
const fs = require("fs")
const sharp = require("sharp")
const archiver = require("archiver")

const Resourcepack = require("./js/resourcepack").Resourcepack
const versionsJson = require("./json/versions.json")
const pathsJson = require("./json/paths.json")

// Binaries
const minecraftVersions = versionsJson.minecraft
const resourcepackVersions = versionsJson.script.version
const resourcepackAltVersions = versionsJson.script.alternative

const scriptAssetsDir = pathsJson.script.assets
const scriptBinariesDir = pathsJson.script.binaries

fs.rmSync(scriptBinariesDir, { recursive: true, force: true })
fs.mkdirSync(scriptBinariesDir, { recursive: true, force: true })

// Minecraft Version forEach
Object.values(minecraftVersions).forEach(minecraftVersion => {

    const binariesMinecraftVersionDir = `${scriptBinariesDir}${minecraftVersion.name}/`

    fs.mkdirSync(binariesMinecraftVersionDir, { recursive: true, force: true })

    // Resourcepack version forEach
    Object.values(resourcepackVersions).forEach(resourcepackVersion => {

        // Create resourcepack object
        const resourcepack = new Resourcepack(minecraftVersion, resourcepackVersion)
        const resourcepackStructure = resourcepack.getStructure()

        // Prepair first layer files
        const resourcepackMcmeta = resourcepack.getMcmeta()
        const resourcepackLanguage = resourcepack.getLanguage()

        // Resourceppack alternative forEach
        Object.values(resourcepackAltVersions).forEach(resourcepackAltVersion => {

            // Set Alternative data inside resourcepack object
            resourcepack.setResourcepackVersionAlt(resourcepackAltVersion)

            // Create second layer files
            const resourcepackTexture = `${scriptAssetsDir}${resourcepackVersion.name}/${resourcepackAltVersion.file_name}`
            const resourcepackIcon = sharp(resourcepackTexture)
                .resize(256, 256, {
                    kernel: sharp.kernel.nearest
                })


            // Create ZIP file
            const binariesResourcepackZip = `${binariesMinecraftVersionDir}${resourcepack.getZip()}`
            const resourcepackOutput = fs.createWriteStream(binariesResourcepackZip)
            const resourcepackArchive = new archiver("zip", {
                zlib: { level: 9 },
            })
            resourcepackArchive.pipe(resourcepackOutput);

            // Add first layer files
            resourcepackArchive.append(resourcepackMcmeta, { name: resourcepackStructure.mcmeta });
            console.log(resourcepackMcmeta)
            resourcepackArchive.append(resourcepackLanguage, { name: resourcepackStructure.language });

            // Add second layer files
            resourcepackArchive.file(resourcepackTexture, { name: resourcepackStructure.texture });
            resourcepackArchive.append(resourcepackIcon, { name: resourcepackStructure.icon });

            resourcepackArchive.finalize();
        })
    })
})
