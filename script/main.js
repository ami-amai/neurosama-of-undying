// Libs
const fs = require("fs")
const sharp = require("sharp")
const archiver = require("archiver")

const Resourcepack = require("./js/resourcepack").Resourcepack
const versionsJson = require("./json/versions.json").versions
const pathsJson = require("./json/paths.json").paths

// Binaries
const minecraftVersions = versionsJson.minecraft
const resourcepackVersions = versionsJson.resourcepack.main
const resourcepackAltVersions = versionsJson.resourcepack.alt

const scriptAssetsDir = pathsJson.script.assets
const scriptBinariesDir = pathsJson.script.binaries

fs.rmSync(`${scriptBinariesDir}`, { recursive: true, force: true })
fs.mkdirSync(`${scriptBinariesDir}`, { recursive: true, force: true })
Object.values(minecraftVersions).forEach(minecraftVersion => {

fs.mkdirSync(`${scriptBinariesDir}${minecraftVersion.name}/`, { recursive: true, force: true })

    Object.values(resourcepackVersions).forEach(resourcepackVersion => {

        const resourcepack = new Resourcepack(minecraftVersion, resourcepackVersion)
        const resourcepackStructure = resourcepack.getStructure()

        const resourcepackMcmeta = `${resourcepack.getMcmeta()}`
        const resourcepackLanguage = `${resourcepack.getLanguage()}`

        Object.values(resourcepackAltVersions).forEach(resourcepackVersionAlt => {

            resourcepack.setResourcepackVersionAlt(resourcepackVersionAlt)

            const sourceDir = `${scriptAssetsDir}${resourcepack.resourcepackVersionName}/${resourcepack.resourcepackVersionAltFile}`

            // Create ZIP file
            const resourcepackZipOutput = fs.createWriteStream(`${scriptBinariesDir}${minecraftVersion.name}/${resourcepack.getName()}.zip`)
            const resourcepackZipArchive = new archiver("zip", {
                zlib: { level: 9 },
            })
            resourcepackZipArchive.pipe(resourcepackZipOutput);

            // add files
            resourcepackZipArchive.append(resourcepackMcmeta, { name: `${resourcepackStructure.mcmeta}` });
            resourcepackZipArchive.file(`${sourceDir}`, { name: `${resourcepackStructure.texture}` });

            const resourcepackIcon = sharp(`${sourceDir}`)
                .resize(256, 256, {
                    kernel: sharp.kernel.nearest
                })
            resourcepackZipArchive.append(resourcepackIcon, { name: `${resourcepackStructure.icon}` });

            resourcepackZipArchive.append(resourcepackLanguage, { name: `${resourcepackStructure.language}` });
            resourcepackZipArchive.finalize();
        })
    })
})
