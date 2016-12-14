const config = {}

config.PORT = process.env.PORT || 3000

config.db_host_local = 'localhost'
config.db_port_local = 5432
config.db_name_local = 'rummydb'
config.db_user_local = 'postgres'
config.db_pass_local = 'postgres'

module.exports = config
