export KUDU_QUICKSTART_IP=$(ifconfig | grep "inet " | grep -Fv 127.0.0.1 |  awk '{print $2}' | tail -1)
docker-compose -f quickstart_kudu.yml up -d
#this is for the quick spinning up of kudu cluster
#can enter impala shell by docker exec -it adhoc_test_kudu-impala_1 impala-shell
#to bring down kudu, docker-compose -f quickstart_kudu.yml down
#
#if create table fails because table exist in docker volume, can try 
#CREATE EXTERNAL TABLE my_thirdA_table
#STORED AS KUDU
#TBLPROPERTIES('kudu.table_name' = 'impala::default.my_third_table');
#to link back the table