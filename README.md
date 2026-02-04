# 🚀 Cloud-Native CI/CD Pipeline: Node.js & Google Cloud

This project demonstrates a professional-grade DevOps workflow for a Node.js application, focusing on **automation, security, and zero-downtime deployments**. It utilizes Docker for containerization and Google Cloud Build for a complete CI/CD lifecycle.

## 🛠 Tech Stack
* **Runtime:** Node.js 18
* **Containerization:** Docker (Multi-stage builds)
* **CI/CD:** Google Cloud Build
* **Registry:** Google Artifact Registry
* **Deployment:** Google Cloud Run (Serverless)
* **Testing:** Automated unit testing & Smoke testing (cURL)

## 🏗 CI/CD Architecture
The pipeline is defined in `cloudbuild.yaml` and follows these rigorous steps:

1.  **Multi-Stage Docker Build:** * **Base & Dependencies:** Optimized caching of `npm install`.
    * **Build & Test:** Runs automated tests inside the container.
    * **Runner:** Creates a production-ready, slim image (`node:18-slim`) using a non-root user for enhanced security.
2.  **Artifact Storage:** Pushes the verified image to Google Artifact Registry with automatic retry logic.
3.  **"Green" Deployment:** Deploys the new version to Cloud Run with **0% traffic** to ensure stability.
4.  **Automated Smoke Test:** Performs an HTTP health check (cURL) on the new revision's unique URL.
5.  **Traffic Shifting:** Automatically shifts 100% of traffic to the new version only if the smoke test passes.

## ⚙️ Setup & Configuration

### 1. Google Cloud Prerequisites
* Enable **Cloud Build, Cloud Run, and Artifact Registry APIs**.
* Create a Docker repository in **Artifact Registry**.

### 2. Connect GitHub to Cloud Build
1. Go to **Cloud Build > Triggers** in the GCP Console.
2. Click **Connect Repository** and select your GitHub repo.
3. Create a new Trigger:
   * **Event:** Push to a branch (e.g., `main`).
   * **Configuration:** Cloud Build configuration file (`/cloudbuild.yaml`).
   * **Substitution Variables:**
     * `_AR_REPO`: Your Artifact Registry name.
     * `_ENV`: `dev`, `staging`, or `prod`.
     * `_REGION`: Your GCP region (e.g., `europe-west1`).
     * `_SERVICE_NAME`: The microservice name.

### 3. IAM Permissions
Ensure the Cloud Build Service Account (`@cloudbuild.gserviceaccount.com`) has the following roles:
* `Cloud Run Admin`
* `Service Account User`
* `Artifact Registry Writer`

## 🐳 Running Locally
To build and run the containerized app locally:

```bash
docker build -t devops-test .
docker run -p 8080:8080 devops-test

## 🗺️ Pipeline Visual Flow

```text
[ Developer ] --(git push)--> [ GitHub Repo ]
                                     |
                                     v
                          [ Google Cloud Build ]
                                     |
       +-----------------------------+-----------------------------+
       |                             |                             |
[ Build & Test ]          [ Push to Registry ]          [ Deploy Green ]
(Multi-stage Docker)      (Artifact Registry)           (Cloud Run 0% Traffic)
       |                             |                             |
       v                             v                             v
  (Unit Tests)                (Image Storage)              (Revision Ready?)
       |                             |                             |
       +-----------------------------+-----------------------------+
                                     |
                                     v
                            [ Automated Smoke Test ]
                            (cURL Health Check 200)
                                     |
                   +-----------------+-----------------+
                   |                                   |
           [ IF SUCCESS ]                      [ IF FAILURE ]
                   |                                   |
          (Shift 100% Traffic)                 (Aborts Pipeline)
                   |                          (Live version stays safe)
                   v                                   v
          [ PRODUCTION LIVE ]                  [ LOGS & ALERT ]
