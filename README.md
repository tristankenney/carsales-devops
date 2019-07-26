# carsales-devops

## Task
* create a simple application (it can be lambda based or other) that will query all the records in Route53, save the info in a simple database and display the results on a very simple front-end.
* Chose any language that suits you
* The DB needs to be mysql
* The info should be updated at regular intervals (a schedule/cron or something similar), eg once every 3 hours.
* A simple front-end is all that’s needed, as it’s only an internal application.
* The front end needs to read the data from the persistent storage and not from the “data-fetching” lambda directly. 
* No need to worry about authentication on the front-end (but it would be great to explain how you would implement it if you had to).



## To Do

### Coding
#### Scheduled Task
Create a lambda that executes on a schedule that queries entire Route53 set, and updates table.
Should iterate hosted zones, collecting records

*Compromises* 
By executing on a scheduled event (as opposed to Route53 CRUD events), the full set of records must always be addressed instead of the modified subset. This could (potentially) have a performance impact. 

Additionally, as this is a scheduled task, there will be a period of potentially stale data

#### DNS API
Create a lambda that queries MySQL database, and returns JSON payload

*Compromises* 
As there is no caching layer, if this is a high-traffic API there could be performance concerns
Additionally, as there is no authentication on the API, DNS data could be compromised

#### Front end
Deployed as a static website to S3 bucket. 

*Compromises* 
Limited flexibility in terms of deployment (can only serve static files), unable to be


### Deployment

#### Database
* Create & configure security groups
* Create RDS instance 
* Create table instance
* Capture RDS instance details

#### Scheduled task
* Create & configure groups
* Deploy serverless (w/ captured RDS instance details) 

#### DNS API
* Create & configure groups
* Deploy API gateway
* Deploy serverless (w/ captured RDS instance details) 

#### Front end
* Create & configure security groups
* Deploy web payload to S3 bucket

## Concerns
IAM Role access
Secrets management (AWS keys)