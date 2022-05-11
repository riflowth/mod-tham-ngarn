# Mod Tham Ngarn
[![CI & CD the frontend](https://github.com/CPE34-KMUTT/mod-tham-ngarn/actions/workflows/ci-cd-frontend.yml/badge.svg)](https://github.com/CPE34-KMUTT/mod-tham-ngarn/actions/workflows/ci-cd-frontend.yml)
[![CI & CD the backend](https://github.com/CPE34-KMUTT/mod-tham-ngarn/actions/workflows/ci-cd-backend.yml/badge.svg)](https://github.com/CPE34-KMUTT/mod-tham-ngarn/actions/workflows/ci-cd-backend.yml)


Mod Tham Ngarn *(web application)* is an industrial business assistant for
machine maintenance, error logging, and service operations in the small-medium factory.

This is a part of **CPE231 Database System project** for learning/practicing about the database system, especially on RDMS.

## Architecture

<img src="https://i.imgur.com/ANFIRls.png" alt="mod tham ngarn system design" />

We provide the frontend project and backend project in this single repository, called monorepo,
using [Lerna](https://github.com/lerna/lerna) for managing stuffs. 

About development workflow, we use GitHub Action for continuous integration (running unit test and build image into the registry)
and continuous deployment (CI/CD) to our personal cloud, running with [Docker Engine](https://www.docker.com/) on Ubuntu LTS,
powered by [DigitalOcean](https://www.digitalocean.com/).

On the frontend, we prefer [Next.js](https://nextjs.org/) with [Tailwind CSS](https://tailwindcss.com/).
> Next.js will give us the best experience writing React, especially on Next.js optimization.

On the backend, we use [Springpress](https://github.com/riflowth/springpress), developed by our organization member.
> Springpress is built on top of Express.js which will impress us into the OOP and the scent of Spring Boot.

<br />

<a href="https://www.digitalocean.com/?refcode=95b43da7102f&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge">
  <img width="150" src="https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%203.svg" alt="DigitalOcean Referral Badge" />
</a>
