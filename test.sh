#!/usr/bin/env bash

WX_PROJ_PATH='/root/.jenkins/workspace/buildOnCloud-wxManager-web-test'
WX_WEB_PATH='/root/.jenkins/workspace/buildOnCloud-wx-page-test'


test(){
  WX_PROJ_PATH='/root/.jenkins/workspace/buildOnCloud-wxManager-web-prod'
  WX_WEB_PATH='/root/.jenkins/workspace/buildOnCloud-wx-page-prod'

}

fuck(){
  echo $WX_PROJ_PATH
  echo $WX_WEB_PATH
}

test
fuck
