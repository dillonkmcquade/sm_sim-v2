BEGIN TRANSACTION;
INSERT INTO users(name, email, nickname, balance, watch_list, auth0_id) VALUES ('name', 'email', 'nickname', 'picture', 1000000, [], 'test');
COMMIT;

