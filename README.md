# Pest Control Standalone Reporting Form

[Online demo](https://pest-control-standalone-reporting-form.vercel.app) | [Local Development](https://github.com/Veeeetzzzz/pest-control-standalone-reporting-form/tree/main?tab=readme-ov-file##local-development) | [Deploying to Production](https://github.com/Veeeetzzzz/pest-control-standalone-reporting-form/tree/main?tab=readme-ov-file##pushing-to-production)

## One Click Deployments

[<img src="https://aka.ms/deploytoazurebutton"/>](https://learn.microsoft.com/en-us/azure/app-service/deploy-github-actions?tabs=openid%2Caspnetcore)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Veeeetzzzz/pest-control-standalone-reporting-form)

Software-as-a-service has become an increasing cost for many local authorities with constant procurements or contract reviews with a view to cut down on expenditure whilst still providing statutory services against a national framework.

Most local authorities don't realise replacing one outsourced solution with another outsourced solution is only a temporary solution. It does not address the root cause.

The solution is simplify the technical stack to enable quick standalone deployment that integrates into other enterprise solutions.

This is being built in public, is provided as an open-source, community maintained alternative for a pest control reporting form/solution.

### Features

- Single Sign On for Microsoft Entra
- Directly submit records to Dynamics 365 or Salesforce CRM endpoint
- Populate form with existing customer details from Microsoft Dynamics or Salesforce CRM

### Roadmap

Key: ✅ Done | 🟢 In Progress | 🟠 Planned

- Photo upload capability ✅
- Risk assessment form based on BCPA guidance 🟠
- Record export/import functionality (CSV, XLS) 🟢
- API development for easy integration with existing systems 🟠

Screenshots:

![image](https://github.com/user-attachments/assets/06035e57-bd2a-4229-a521-a56bf62bbc39)

![image](https://github.com/user-attachments/assets/0bcf0878-c2d1-42f4-b353-e12fa36bea12)

## Local Development

- Download repository by running  ```git clone https://github.com/Veeeetzzzz/pest-control-standalone-reporting-form```
- Swap directory by running ```cd pest-control-standalone-reporting-form ```
- Install requirements with ```npm install```    
- Update .env file with Dynamics/Salesforce API keys
- Update [authConfig.ts](https://github.com/Veeeetzzzz/pest-control-standalone-reporting-form/blob/main/src/components/authConfig.ts) for Azure Single Sign On
- Run ```npm run dev``` to start the dev server. The page refreshes as you update/save the file.

## Pushing to Production 

- Use any host that supports Next.js
- Self host using your own Vercel instance with [one click](https://vercel.com/new/clone?repository-url=https://github.com/Veeeetzzzz/pest-control-standalone-reporting-form)
- Configure a CI/CD pipeline [using your Enterprise Azure Infrastructure ](https://learn.microsoft.com/en-us/azure/app-service/deploy-github-actions?tabs=openid%2Caspnetcore)
