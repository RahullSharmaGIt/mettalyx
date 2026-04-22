--
-- PostgreSQL database dump
--

\restrict ejIEwIb7vgwVW53j088dCeZ1OXvyqeglnemw1Qfe3toAcP7GSZiRAuajaSbhLNZ

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: BidRejectionReason; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BidRejectionReason" AS ENUM (
    'PRICE',
    'LEAD_TIME',
    'GENERAL'
);


ALTER TYPE public."BidRejectionReason" OWNER TO postgres;

--
-- Name: BidStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BidStatus" AS ENUM (
    'PENDING',
    'REJECTED',
    'WON'
);


ALTER TYPE public."BidStatus" OWNER TO postgres;

--
-- Name: JobStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JobStatus" AS ENUM (
    'PENDING_REVIEW',
    'OPEN',
    'ASSIGNED',
    'IN_PROGRESS',
    'QC',
    'COMPLETED',
    'PAID',
    'CANCELLED'
);


ALTER TYPE public."JobStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'OEM',
    'VENDOR'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

--
-- Name: VendorStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VendorStatus" AS ENUM (
    'PENDING',
    'VERIFIED',
    'REJECTED'
);


ALTER TYPE public."VendorStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: FileAccessLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FileAccessLog" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "fileId" text NOT NULL,
    "jobId" text NOT NULL,
    "ipAddress" text,
    "accessedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."FileAccessLog" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: bids; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bids (
    id text NOT NULL,
    "vendorId" text NOT NULL,
    "jobId" text NOT NULL,
    "proposedPrice" double precision NOT NULL,
    "proposedLeadTime" integer NOT NULL,
    notes text,
    status public."BidStatus" DEFAULT 'PENDING'::public."BidStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isLocked" boolean DEFAULT false NOT NULL,
    "unlockRequested" boolean DEFAULT false NOT NULL,
    "updateCount" integer DEFAULT 0 NOT NULL,
    "adminFeedback" text,
    "rejectionReason" public."BidRejectionReason"
);


ALTER TABLE public.bids OWNER TO postgres;

--
-- Name: job_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_files (
    id text NOT NULL,
    "jobId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fileKey" text NOT NULL,
    "mimeType" text,
    "originalName" text NOT NULL,
    size integer,
    "uploadedBy" text NOT NULL
);


ALTER TABLE public.job_files OWNER TO postgres;

--
-- Name: job_status_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_status_logs (
    id text NOT NULL,
    "jobId" text NOT NULL,
    status public."JobStatus" NOT NULL,
    note text,
    "changedBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.job_status_logs OWNER TO postgres;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    material text NOT NULL,
    quantity integer NOT NULL,
    tolerance text,
    deadline timestamp(3) without time zone NOT NULL,
    location text NOT NULL,
    status public."JobStatus" DEFAULT 'PENDING_REVIEW'::public."JobStatus" NOT NULL,
    "oemId" text NOT NULL,
    "vendorId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    lat double precision,
    lng double precision,
    "materialGrade" text,
    "surfaceFinish" text,
    "minPriceFloor" double precision,
    "targetVendorPrice" double precision
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text,
    "companyName" text,
    role public."UserRole" DEFAULT 'OEM'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: vendor_capabilities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_capabilities (
    id text NOT NULL,
    "vendorId" text NOT NULL,
    capabilities text[],
    "expertiseLevel" text,
    "tolerancesSupported" text,
    "maxPartSize" text,
    "minPartSize" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.vendor_capabilities OWNER TO postgres;

--
-- Name: vendor_certifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_certifications (
    id text NOT NULL,
    "vendorId" text NOT NULL,
    name text NOT NULL,
    "certificateUrl" text NOT NULL,
    "issuedBy" text,
    "issuedDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.vendor_certifications OWNER TO postgres;

--
-- Name: vendor_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_documents (
    id text NOT NULL,
    "vendorId" text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    type text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.vendor_documents OWNER TO postgres;

--
-- Name: vendor_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_profiles (
    id text NOT NULL,
    "userId" text NOT NULL,
    status public."VendorStatus" DEFAULT 'PENDING'::public."VendorStatus" NOT NULL,
    address text,
    city text,
    lat double precision,
    lng double precision,
    "verifiedAt" timestamp(3) without time zone,
    "isOnboarded" boolean DEFAULT false NOT NULL,
    "companyName" text,
    "contactEmail" text,
    "contactPhone" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "gstNumber" text,
    "industriesServed" jsonb,
    "isAgreementAccepted" boolean DEFAULT false NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "yearsOfExperience" integer
);


ALTER TABLE public.vendor_profiles OWNER TO postgres;

--
-- Data for Name: FileAccessLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FileAccessLog" (id, "userId", "fileId", "jobId", "ipAddress", "accessedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
28cf2ffc-5719-4d8e-8b72-d4c398a4e20b	edabb55d5029ba0b81d4b760712c7d30f7d681900d37b17622019b152048652a	2026-03-08 16:16:17.568023+00	20260215165240_add_vendor_geolocation	\N	\N	2026-03-08 16:16:17.546692+00	1
c3d370a6-4179-424a-92c4-7240f9de19d0	cfbd14e025c99642daf71b2ea7b695db074b63f921a4f4e2d290366afddfc2d4	2026-03-08 16:16:17.570186+00	20260218103134_add_job_geocoords	\N	\N	2026-03-08 16:16:17.568629+00	1
c20411c3-234c-4580-b692-1e6371e396db	3c4fed7c5d468324a751eb733aaacd047c98134bb2c2c7753bd70da1e9f17311	2026-03-24 17:27:55.204415+00	20260324172755_vendor_onboarding_upgrade	\N	\N	2026-03-24 17:27:55.181705+00	1
f1207e76-35c1-4145-8573-6b31b6dcdfa5	fea905375015c4b38806eaf381a95c3a50764d2c78abc171a5829ce81b0b7646	2026-04-03 12:00:31.170046+00	20260403120031_add_material_grade_surface_finish	\N	\N	2026-04-03 12:00:31.167779+00	1
d8dbee3d-ad39-4a30-98f1-1b44a6d001af	82acfaae4c2932a2c856ac550e994b2fbdde6dee268740f9b3a6d64f6f584425	2026-04-06 11:19:42.110102+00	20260406111942_secure_job_files	\N	\N	2026-04-06 11:19:42.093779+00	1
611a45ee-d42e-472d-8d32-3d3339700a90	53f497b0c5e597d0eb5b258aa7955445f26dabf5b86f51b3ac224088f0685a8c	2026-04-06 20:02:44.700592+00	20260406200244_make_job_file_job_id_optional	\N	\N	2026-04-06 20:02:44.698719+00	1
69b5da4f-4f7a-4132-b91b-b9d569bccff3	2d46337f401bf97cb17c7fdf302a5390c2f20602e95db67df5beed4ca29a9aff	2026-04-07 11:46:36.503024+00	20260407114636_add_vendor_bidding	\N	\N	2026-04-07 11:46:36.49546+00	1
3a436ac7-43d0-4a09-adbb-698a8700cf23	64537a83b192840500ba67746f853ca5a11741b96f6e7ccb215753945de7ac24	2026-04-08 11:00:58.843458+00	20260408110058_managed_revision_bids	\N	\N	2026-04-08 11:00:58.841596+00	1
dc35a7e2-2bdb-44ca-baf3-32ec89a5d53c	197357d48f7a0fb951044952cac92962f072f1fbf3345dd5aae7ba16c7686195	2026-04-08 11:58:04.784666+00	20260408115804_award_job_secure_handover	\N	\N	2026-04-08 11:58:04.777382+00	1
\.


--
-- Data for Name: bids; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bids (id, "vendorId", "jobId", "proposedPrice", "proposedLeadTime", notes, status, "createdAt", "updatedAt", "isLocked", "unlockRequested", "updateCount", "adminFeedback", "rejectionReason") FROM stdin;
cmnokpq1s0005rqtzw9k6uc1p	cmnk71fof0004rqzz6vrbzf5k	cmnokd9tx0004rq3k0fuupmv4	91	12		WON	2026-04-07 12:06:24.545	2026-04-08 13:04:39.129	f	f	0	\N	\N
cmnoknb8x0003rqtz2z5ju2yr	cmn5picrt0000rq6qwnokqawk	cmnokd9tx0004rq3k0fuupmv4	95	10		REJECTED	2026-04-07 12:04:32.049	2026-04-08 13:04:39.131	f	f	0	sorry for not selecting 95	PRICE
cmnokpypx0007rqtz746g49bd	cmnk71fof0004rqzz6vrbzf5k	cmnofh52n0001rq3ko6oi0wx3	79	11		WON	2026-04-07 12:06:35.782	2026-04-14 07:52:51.241	f	f	0	\N	\N
cmnokmznu0001rqtz37q0euno	cmn5picrt0000rq6qwnokqawk	cmnofh52n0001rq3ko6oi0wx3	93	10		REJECTED	2026-04-07 12:04:17.034	2026-04-14 07:52:51.244	f	f	0	note for the job not getting due to price 93	LEAD_TIME
cmnybwew40005rq3xqa3w12bs	cmnk71fof0004rqzz6vrbzf5k	cmnvl680e0000rqosiv256w44	90000	19		PENDING	2026-04-14 07:57:21.892	2026-04-14 07:57:21.892	f	f	0	\N	\N
cmnybuwvb0003rq3xv3zrvlfk	cmn5picrt0000rq6qwnokqawk	cmnvl680e0000rqosiv256w44	90000	90		PENDING	2026-04-14 07:56:11.879	2026-04-14 08:02:32.582	f	f	0	\N	\N
\.


--
-- Data for Name: job_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_files (id, "jobId", "createdAt", "fileKey", "mimeType", "originalName", size, "uploadedBy") FROM stdin;
cmnofh0jj0000rq3k1xv1w35o	cmnofh52n0001rq3ko6oi0wx3	2026-04-07 09:39:40.16	files/a1c042eb-903c-4211-8d86-c2ac091e7e46.pdf	application/pdf	RAHUL_RESUME.pdf	50023	cmmhynmk00000rqhzg2ifp8oa
\.


--
-- Data for Name: job_status_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_status_logs (id, "jobId", status, note, "changedBy", "createdAt") FROM stdin;
cmnk5huvt0003rqzzd81q7vz7	cmnjzjg550000rqzzc38u8d3j	ASSIGNED	Vendor assigned by Admin	cmmhyfkld0000rq5juinejq1d	2026-04-04 09:49:18.617
cmnofhmsd0003rq3k591v14x4	cmnofh52n0001rq3ko6oi0wx3	PENDING_REVIEW	File "RAHUL_RESUME.pdf" downloaded by ADMIN [cmmhyfkld0000rq5juinejq1d]	cmmhyfkld0000rq5juinejq1d	2026-04-07 09:40:08.989
cmnq28h5o0001rq8u2ca8naro	cmnokd9tx0004rq3k0fuupmv4	ASSIGNED	Job awarded to vendor: cmnk71fof0004rqzz6vrbzf5k	cmmhyfkld0000rq5juinejq1d	2026-04-08 13:04:39.133
cmnybqm250001rq3xwy20illk	cmnofh52n0001rq3ko6oi0wx3	ASSIGNED	Job awarded to vendor: cmnk71fof0004rqzz6vrbzf5k	cmmhyfkld0000rq5juinejq1d	2026-04-14 07:52:51.245
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (id, title, description, material, quantity, tolerance, deadline, location, status, "oemId", "vendorId", "createdAt", "updatedAt", lat, lng, "materialGrade", "surfaceFinish", "minPriceFloor", "targetVendorPrice") FROM stdin;
cmnjzjg550000rqzzc38u8d3j	CNC machining 	this jobs is for CNC machining 	Steel	40	0.04	2026-04-11 00:00:00	Delhi	ASSIGNED	cmmhynmk00000rqhzg2ifp8oa	cmmkjrn6u0000rqofyltukeyz	2026-04-04 07:02:35.129	2026-04-04 09:49:18.612	28.6138954	77.2090057	SS304	Anodized 	\N	\N
cmnk58ynb0001rqzzrpq6wm1g	Injection Molding	Job for Injection Molding	Aluminium	100	0.04	2026-04-17 00:00:00	Faridabad	ASSIGNED	cmmhynmk00000rqhzg2ifp8oa	cmnk71fof0004rqzz6vrbzf5k	2026-04-04 09:42:23.591	2026-04-04 11:58:17.828	28.4031478	77.3105561	SS304	Anodized 	\N	\N
cmnokd9tx0004rq3k0fuupmv4	oem 4	oem 4	Aluminium	112	0.04	2026-04-22 00:00:00	delhi	ASSIGNED	cmmhynmk00000rqhzg2ifp8oa	cmnk71fof0004rqzz6vrbzf5k	2026-04-07 11:56:43.653	2026-04-08 13:04:39.125	28.6138954	77.2090057	SS304	Anodized 	90	91
cmnvl680e0000rqosiv256w44	Oem job 2 	description of jobs by oem 2	Aluminium	10	0.04	2026-04-16 00:00:00	Faridabad	OPEN	cmmry0u440002rqthwe0dxwa5	\N	2026-04-12 09:53:37.551	2026-04-12 09:54:49.308	28.4031478	77.3105561	SS304	Anodized 	90000	10000
cmnofh52n0001rq3ko6oi0wx3	new job 3 	new job 3	Steel	11	0.04	2026-04-14 00:00:00	201011	ASSIGNED	cmmhynmk00000rqhzg2ifp8oa	cmnk71fof0004rqzz6vrbzf5k	2026-04-07 09:39:46.032	2026-04-14 07:52:51.235	28.66953	77.3347662	SS304	Anodized 	\N	79
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, name, "companyName", role, "createdAt") FROM stdin;
cmmhyfkld0000rq5juinejq1d	admin@metallyx.com	$2b$10$EYM/6G1mRWKDvC0uorYi3eFWowGX0SIVCMy4JUqW90MX0U3Lmfyuu	Admin User	\N	ADMIN	2026-03-08 16:16:19.969
cmmhynmk00000rqhzg2ifp8oa	oem@test.com	$2b$10$BZv81LaaZbmtKpfaIEej.OLyjkHS/inmeFHrdrg.jWMP49plbewUu	oem1	oem1	OEM	2026-03-08 16:22:35.76
cmmkjrn6u0000rqofyltukeyz	vendor@test.com	$2b$10$lYX9lUquq54i8oY/YMI/xenqi0aIpqZTIus2tDaHGvoFxV8hwT5Ie	vendor	qwe	VENDOR	2026-03-10 11:49:07.494
cmmry0u440002rqthwe0dxwa5	oem2@example.com	$2b$10$.kG.MjckVmjQDimHP5o0Fe/ZFgoMabLC59OWiFMierlk2evVmmt2a	OEM	oem2	OEM	2026-03-15 16:02:34.229
cmn5picrt0000rq6qwnokqawk	vendor2@test.com	$2b$10$UN.w7XOW9oHQoWBoo2QtLendz7Ftf3rn6HnPxbCmywol5RDzFDMFO	asads	new name	VENDOR	2026-03-25 07:13:01.481
cmnk71fof0004rqzz6vrbzf5k	vendor1@test.com	$2b$10$oo4NNodN3eC6p1wh70wL0uU/1Sn11je/lnxL8EipXuuW9nSKHVyN6	vendor1@test.com	vendor 1 company 	VENDOR	2026-04-04 10:32:31.648
\.


--
-- Data for Name: vendor_capabilities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendor_capabilities (id, "vendorId", capabilities, "expertiseLevel", "tolerancesSupported", "maxPartSize", "minPartSize", "createdAt", "updatedAt") FROM stdin;
cmn5pmd9w0006rq6qsz12frxd	cmn5picry0002rq6qsj0ukk8o	{"Sheet Metal",Welding,EDM,"Injection Molding"}	Intermediate	123	123123	123	2026-03-25 07:16:08.756	2026-03-26 20:03:38.739
cmnk753iu000arqzzrul6k3mv	cmnk71fol0006rqzz7nw02pif	{"CNC Machining","Laser Cutting"}	Intermediate	0.12	1123x123x123	3x3x3	2026-04-04 10:35:22.519	2026-04-04 10:35:22.519
\.


--
-- Data for Name: vendor_certifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendor_certifications (id, "vendorId", name, "certificateUrl", "issuedBy", "issuedDate", "createdAt", "updatedAt") FROM stdin;
cmn5pmda10007rq6qk50uot89	cmn5picry0002rq6qsj0ukk8o	123123	https://dummy-storage.com/1774422947601-Screenshot 2026-03-07 at 9.47.52 AM.png	asfasd	2026-03-26 00:00:00	2026-03-25 07:16:08.761	2026-03-25 07:16:08.761
\.


--
-- Data for Name: vendor_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendor_documents (id, "vendorId", name, url, type, "createdAt", "updatedAt") FROM stdin;
cmn5pmda40008rq6quo3pt2s1	cmn5picry0002rq6qsj0ukk8o	Sample Work	https://dummy-storage.com/1774422929716-Screenshot 2026-03-20 at 11.57.03 AM.png	SAMPLE_WORK	2026-03-25 07:16:08.765	2026-03-25 07:16:08.765
cmn5pmda40009rq6qdxvanlb7	cmn5picry0002rq6qsj0ukk8o	ISO Certificate	https://dummy-storage.com/1774422959138-Screenshot 2026-03-03 at 8.32.57 PM.png	ISO_CERTIFICATE	2026-03-25 07:16:08.765	2026-03-25 07:16:08.765
cmn5pmda4000arq6qnv0qhvib	cmn5picry0002rq6qsj0ukk8o	Compliance Proof	https://dummy-storage.com/1774422961868-Screenshot 2026-03-10 at 5.30.51 AM.png	COMPLIANCE_PROOF	2026-03-25 07:16:08.765	2026-03-25 07:16:08.765
\.


--
-- Data for Name: vendor_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendor_profiles (id, "userId", status, address, city, lat, lng, "verifiedAt", "isOnboarded", "companyName", "contactEmail", "contactPhone", "createdAt", "gstNumber", "industriesServed", "isAgreementAccepted", "updatedAt", "yearsOfExperience") FROM stdin;
cmn5picry0002rq6qsj0ukk8o	cmn5picrt0000rq6qwnokqawk	VERIFIED	asdasd	asdasd	28.67243096580362	77.33934916211504	2026-03-25 12:38:10.321	t	new name	vendor@test.com	1212121212	2026-03-25 07:13:01.486	1231	["Automotive", "Aerospace"]	t	2026-03-26 20:03:07.081	1
cmnk71fol0006rqzz7nw02pif	cmnk71fof0004rqzz6vrbzf5k	VERIFIED	vendor based in delhi 	Ghaziabad	28.67219035795852	77.33969551373994	2026-04-04 10:38:44.415	t	vendor 1 company 	vendor1@test.com	1234567890	2026-04-04 10:32:31.653	123456789	["Automotive"]	t	2026-04-04 10:38:44.416	1
\.


--
-- Name: FileAccessLog FileAccessLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileAccessLog"
    ADD CONSTRAINT "FileAccessLog_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: bids bids_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_pkey PRIMARY KEY (id);


--
-- Name: job_files job_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_files
    ADD CONSTRAINT job_files_pkey PRIMARY KEY (id);


--
-- Name: job_status_logs job_status_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_status_logs
    ADD CONSTRAINT job_status_logs_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vendor_capabilities vendor_capabilities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_capabilities
    ADD CONSTRAINT vendor_capabilities_pkey PRIMARY KEY (id);


--
-- Name: vendor_certifications vendor_certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_certifications
    ADD CONSTRAINT vendor_certifications_pkey PRIMARY KEY (id);


--
-- Name: vendor_documents vendor_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_documents
    ADD CONSTRAINT vendor_documents_pkey PRIMARY KEY (id);


--
-- Name: vendor_profiles vendor_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_profiles
    ADD CONSTRAINT vendor_profiles_pkey PRIMARY KEY (id);


--
-- Name: bids_jobId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bids_jobId_idx" ON public.bids USING btree ("jobId");


--
-- Name: bids_vendorId_jobId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "bids_vendorId_jobId_key" ON public.bids USING btree ("vendorId", "jobId");


--
-- Name: job_files_fileKey_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "job_files_fileKey_key" ON public.job_files USING btree ("fileKey");


--
-- Name: job_files_jobId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "job_files_jobId_idx" ON public.job_files USING btree ("jobId");


--
-- Name: job_files_uploadedBy_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "job_files_uploadedBy_idx" ON public.job_files USING btree ("uploadedBy");


--
-- Name: job_status_logs_jobId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "job_status_logs_jobId_idx" ON public.job_status_logs USING btree ("jobId");


--
-- Name: jobs_oemId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "jobs_oemId_idx" ON public.jobs USING btree ("oemId");


--
-- Name: jobs_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX jobs_status_idx ON public.jobs USING btree (status);


--
-- Name: jobs_vendorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "jobs_vendorId_idx" ON public.jobs USING btree ("vendorId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: vendor_capabilities_vendorId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "vendor_capabilities_vendorId_key" ON public.vendor_capabilities USING btree ("vendorId");


--
-- Name: vendor_certifications_vendorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "vendor_certifications_vendorId_idx" ON public.vendor_certifications USING btree ("vendorId");


--
-- Name: vendor_documents_vendorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "vendor_documents_vendorId_idx" ON public.vendor_documents USING btree ("vendorId");


--
-- Name: vendor_profiles_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "vendor_profiles_userId_key" ON public.vendor_profiles USING btree ("userId");


--
-- Name: FileAccessLog FileAccessLog_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileAccessLog"
    ADD CONSTRAINT "FileAccessLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FileAccessLog FileAccessLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileAccessLog"
    ADD CONSTRAINT "FileAccessLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bids bids_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bids
    ADD CONSTRAINT "bids_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bids bids_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bids
    ADD CONSTRAINT "bids_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_files job_files_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_files
    ADD CONSTRAINT "job_files_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_status_logs job_status_logs_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_status_logs
    ADD CONSTRAINT "job_status_logs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: jobs jobs_oemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT "jobs_oemId_fkey" FOREIGN KEY ("oemId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: jobs jobs_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT "jobs_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: vendor_capabilities vendor_capabilities_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_capabilities
    ADD CONSTRAINT "vendor_capabilities_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public.vendor_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vendor_certifications vendor_certifications_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_certifications
    ADD CONSTRAINT "vendor_certifications_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public.vendor_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vendor_documents vendor_documents_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_documents
    ADD CONSTRAINT "vendor_documents_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public.vendor_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vendor_profiles vendor_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_profiles
    ADD CONSTRAINT "vendor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict ejIEwIb7vgwVW53j088dCeZ1OXvyqeglnemw1Qfe3toAcP7GSZiRAuajaSbhLNZ

