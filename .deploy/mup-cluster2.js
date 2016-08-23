module.exports = {
    servers: {
        cluster_2: {
            host: 'ryanwatts.me',
            username: 'root',
            pem: 'D:/cygwin64/home/rwatts/.ssh/id_rsa'
        }
    },

    meteor: {
        name: 'react-material-cluster2',
        path: '../',
        servers: {
            cluster_2: {}
        },
        docker: {
            image: 'kadirahq/meteord'
        },
        buildOptions: {
            serverOnly: true,
            debug: true,
            cleanAfterBuild: true
        },
        env: {
            ROOT_URL: 'http://react-material.app.ryanwatts.me',
            MONGO_URL: 'mongodb://mongo.app.ryanwatts.me/react-material',
			PORT: 4089
        },

        deployCheckWaitTime: 60
    }
};