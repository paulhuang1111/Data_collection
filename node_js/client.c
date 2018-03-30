#include <stdio.h>
#include <curl/curl.h>
#include <unistd.h>
#include <time.h>
#include <jansson.h>

void main(void)
{
  while(1) {
    if (send_data()==0) {
      printf("send data success!\n");
    } else {
      printf("send data fail!\n");
    }
    sleep(30);
  }
}

int send_data(void)
{
  CURL *curl = NULL;
  CURLcode res;
  int temp, humid;
  json_t *data;
  char *str = NULL;
  struct curl_slist *headers = NULL;  

  temp = (rand() % 100);
  humid = (rand() % 100);


  curl = curl_easy_init();
  if(curl) {
    /*Setup URL data*/
    curl_easy_setopt(curl, CURLOPT_URL, "http://127.0.0.1:3000/api/data_add");
     
    /*Setup content format is JSON*/
    headers = curl_slist_append(headers, "Content-Type: application/json");

    /*Create json objetc for post*/
    data = json_object();

    /*Build post data*/
    json_object_set_new(data, "temp", json_integer(temp));
    json_object_set_new(data, "humid", json_integer(humid));

    str = json_dumps(data, 0);
    /*Set curl options*/
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

    /* Perform the request, res will get the return code */ 
    res = curl_easy_perform(curl);
    /* Check for errors */ 
    if(res != CURLE_OK)
      fprintf(stderr, "curl_easy_perform() failed: %s\n",
              curl_easy_strerror(res));
 
    /* always cleanup */ 
    curl_easy_cleanup(curl);
  }
  return 0;
}
