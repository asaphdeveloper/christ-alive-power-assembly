HASH password when updated (use .save())

## PDF resource uploads

Resource PDFs are stored in Cloudflare R2; MongoDB stores each PDF's category, display name, object key, size, and uploader. Create an R2 Standard bucket and an Object Read & Write API token scoped only to that bucket. Configure the `R2_*` backend environment variables from `.env.example`; never expose the R2 secret or token in frontend environment variables.

The upload API accepts PDF files up to 20 MB and checks both the declared file type and the PDF signature. Uploads are restricted to developers and headquarter media admins. Public read and download endpoints stream the PDF through the API so R2 request counts can be tracked by this app.

The app defaults to an 8 GiB tracked-storage ceiling, 9 million tracked reads, and 900,000 tracked writes per UTC month. These thresholds are intentionally below R2's free allowances, but they only measure this app's requests and objects. Other activity in the same Cloudflare account/bucket can use the shared free allowance and incur charges. R2 does not provide a strict account-wide spending cap; monitor Cloudflare billing and use an account dedicated to this application if you need the app counters to closely track total usage.

Set `VITE_API_URL` in the frontend build environment when the backend API is hosted on a different origin. The login page stores the short-lived bearer token in browser local storage for authenticated admin requests.
