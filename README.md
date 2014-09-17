
[![Build Status](./assets/logo.jpg)](./assets/logo.jpg)

 [![Build Status](https://travis-ci.org/tommywu23/GTRecordService.svg)](https://travis-ci.org/tommywu23/GTRecordService)
 [![Dependency Status](https://img.shields.io/gemnasium/tommywu23/GTRecordService.svg)](https://gemnasium.com/tommywu23/GTRecordService)

===============

## Installation

A control of MTS service,via RESTFul

MTS - Streaming Media Transmission Server

===============

## API

## 1. Start Command

client request start group of SM(Streaming Media)

POST /Recording

Content-type: application/json
Encoding: utf8

Content:
[
{},{}
]

Response:

Error:

## 2. Stop Command

client request stop group of SM(Streaming Media)

DELETE /Recording

Content-type: application/json
Encoding: utf8

Content:
[
{},{}
]

Response:

Error:

## 3. Get current recording running status

client request get all of SM(Streaming Media) recording status

GET /Recording

Content-type: application/json
Encoding: utf8

Content:
[
{},{}
]

Response:

Error:


