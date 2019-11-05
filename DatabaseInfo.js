module.exports = {
    getDatabaseName() {
        const database = 'cs5220stu21'
        return database
    },

    getUrlWithUsernamePassword() {
        const username = 'cs5220stu21'
        const pwd = 'CAORqZiMyUls'
        const database = module.exports.getDatabaseName()
        const host = 'ecst-csproj2.calstatela.edu'
        const port = '6317'

        const user = encodeURIComponent(username)
        const password = encodeURIComponent(pwd)

        return `mongodb://${user}:${password}@${host}:${port}/${database}`
    },

    getUrlLocalhost() {
        return 'mongodb://localhost:27017'
    }

}