--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)

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
-- Name: ModeAbsensi; Type: TYPE; Schema: public; Owner: jurnal_user
--

CREATE TYPE public."ModeAbsensi" AS ENUM (
    'MASUK_SAJA',
    'MASUK_PULANG'
);


ALTER TYPE public."ModeAbsensi" OWNER TO jurnal_user;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: jurnal_user
--

CREATE TYPE public."Role" AS ENUM (
    'STUDENT',
    'TEACHER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO jurnal_user;

--
-- Name: TipeAbsensi; Type: TYPE; Schema: public; Owner: jurnal_user
--

CREATE TYPE public."TipeAbsensi" AS ENUM (
    'MASUK',
    'PULANG'
);


ALTER TYPE public."TipeAbsensi" OWNER TO jurnal_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: jurnal_user
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


ALTER TABLE public._prisma_migrations OWNER TO jurnal_user;

--
-- Name: absensis; Type: TABLE; Schema: public; Owner: jurnal_user
--

CREATE TABLE public.absensis (
    id text NOT NULL,
    tanggal date NOT NULL,
    "waktuMasuk" timestamp(3) without time zone,
    "waktuPulang" timestamp(3) without time zone,
    tipe public."TipeAbsensi" NOT NULL,
    "studentId" text NOT NULL,
    "tempatPklId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.absensis OWNER TO jurnal_user;

--
-- Name: jurnal_comments; Type: TABLE; Schema: public; Owner: jurnal_user
--

CREATE TABLE public.jurnal_comments (
    id text NOT NULL,
    comment text NOT NULL,
    "jurnalId" text NOT NULL,
    "teacherId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.jurnal_comments OWNER TO jurnal_user;

--
-- Name: jurnals; Type: TABLE; Schema: public; Owner: jurnal_user
--

CREATE TABLE public.jurnals (
    id text NOT NULL,
    tanggal date NOT NULL,
    kegiatan text NOT NULL,
    dokumentasi text,
    "studentId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.jurnals OWNER TO jurnal_user;

--
-- Name: setting_absensis; Type: TABLE; Schema: public; Owner: jurnal_user
--

CREATE TABLE public.setting_absensis (
    id text NOT NULL,
    "modeAbsensi" public."ModeAbsensi" NOT NULL,
    "tempatPklId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.setting_absensis OWNER TO jurnal_user;

--
-- Name: students; Type: TABLE; Schema: public; Owner: jurnal_user
--

CREATE TABLE public.students (
    id text NOT NULL,
    "userId" text NOT NULL,
    nisn text NOT NULL,
    kelas text NOT NULL,
    jurusan text NOT NULL,
    "tempatPklId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "teacherId" text
);


ALTER TABLE public.students OWNER TO jurnal_user;

--
-- Name: teachers; Type: TABLE; Schema: public; Owner: jurnal_user
--

CREATE TABLE public.teachers (
    id text NOT NULL,
    "userId" text NOT NULL,
    nip text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.teachers OWNER TO jurnal_user;

--
-- Name: tempat_pkl; Type: TABLE; Schema: public; Owner: jurnal_user
--

CREATE TABLE public.tempat_pkl (
    id text NOT NULL,
    nama text NOT NULL,
    alamat text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "pinAbsensi" text NOT NULL
);


ALTER TABLE public.tempat_pkl OWNER TO jurnal_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: jurnal_user
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    role public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "passwordHash" text NOT NULL,
    username text NOT NULL
);


ALTER TABLE public.users OWNER TO jurnal_user;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: jurnal_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e49351d3-f592-482a-9dde-1db7071c95aa	540661e627dd9d5ac701369e7fddf557fdf403cae996978f84603e7925c9ffea	2025-06-05 05:04:27.76296+00	20250531052413_init	\N	\N	2025-06-05 05:04:27.684492+00	1
77ffaa2e-a83d-49d1-b76b-f8d9f1f63dbc	d9aa2333f5e85c6b28294be23df4fbf3179e0cdfc0b6322708a8cb6eb80a7500	2025-06-05 05:04:27.769792+00	20250531053519_add_username_password	\N	\N	2025-06-05 05:04:27.764468+00	1
b019929a-7601-4f84-9949-164d469107fe	07068d0e1d0e0b0807a02ec3268387fe3623bcdeddc90c3b43c06e42b5ea707b	2025-06-05 05:04:27.775405+00	20250601035359_add_teacher_student_relation	\N	\N	2025-06-05 05:04:27.771139+00	1
f12829b2-bafa-49a3-970c-7c8103d0c16f	c44ef94ee5b7032837c0d611e1d900e16a9dc7db924955db11d6ab93f3a24c98	2025-06-05 05:04:27.814915+00	20250603154719_fix_tempat_pkl_schema	\N	\N	2025-06-05 05:04:27.776647+00	1
\.


--
-- Data for Name: absensis; Type: TABLE DATA; Schema: public; Owner: jurnal_user
--

COPY public.absensis (id, tanggal, "waktuMasuk", "waktuPulang", tipe, "studentId", "tempatPklId", "createdAt", "updatedAt") FROM stdin;
cmbkegw610001tws25exf17sz	2025-06-06	\N	2025-06-06 06:04:01.973	PULANG	cmbiwwmam000ftw0f0u11ve8o	tempat2	2025-06-06 06:04:02.137	2025-06-06 06:04:02.137
cmbvsddrk0001twlk3oo07l8t	2025-06-14	\N	2025-06-14 05:18:40.825	PULANG	cmbiwwmam000ftw0f0u11ve8o	tempat2	2025-06-14 05:18:40.874	2025-06-14 05:18:40.874
cmcbnw69500octwlkasprrg10	2025-06-25	\N	2025-06-25 07:57:38.246	PULANG	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-06-25 07:57:38.341	2025-06-25 07:57:38.341
cmcbnx4gi00oetwlkoxv4iu4d	2025-06-25	\N	2025-06-25 07:58:22.67	PULANG	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-06-25 07:58:22.675	2025-06-25 07:58:22.675
cmcbo7n7400oktwlk3d3f49d4	2025-06-25	\N	2025-06-25 08:06:33.514	PULANG	cmc46trp000ihtwlkk9doz5ah	cmca53cvo00o5twlke9erzxzp	2025-06-25 08:06:33.52	2025-06-25 08:06:33.52
cmcbovd9g00oqtwlkmk9w689q	2025-06-25	\N	2025-06-25 08:25:00.382	PULANG	cmc46u2oh00jmtwlkal64ma59	cmca53uno00o7twlkyp4pdtpz	2025-06-25 08:25:00.388	2025-06-25 08:25:00.388
cmcckothy00owtwlklcvq7lcx	2025-06-25	2025-06-25 23:15:42.513	\N	MASUK	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-06-25 23:15:42.536	2025-06-25 23:15:42.536
cmcclk14400oytwlkx27wy7i9	2025-06-25	2025-06-25 23:39:58.746	\N	MASUK	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-06-25 23:39:58.756	2025-06-25 23:39:58.756
cmcfhptms0001twsft2u03ki4	2025-06-28	2025-06-28 00:15:48.966	\N	MASUK	cmc46trp000ihtwlkk9doz5ah	cmca53cvo00o5twlke9erzxzp	2025-06-28 00:15:49.052	2025-06-28 00:15:49.052
cmciab7rq0001twsrf3syg17l	2025-06-29	2025-06-29 23:11:48.671	\N	MASUK	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-06-29 23:11:48.735	2025-06-29 23:11:48.735
cmciazgnk0003twsrp81jf8sz	2025-06-29	2025-06-29 23:30:40.007	\N	MASUK	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-06-29 23:30:40.016	2025-06-29 23:30:40.016
cmcit7p870005twsrzufabm6k	2025-06-30	\N	2025-06-30 08:00:57.457	PULANG	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-06-30 08:00:57.463	2025-06-30 08:00:57.463
cmcit7zv50007twsrbffpyxdv	2025-06-30	\N	2025-06-30 08:01:11.246	PULANG	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-06-30 08:01:11.249	2025-06-30 08:01:11.249
cmcjq91x7000ftwsr3qjcc68q	2025-06-30	2025-06-30 23:25:47.885	\N	MASUK	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-06-30 23:25:47.892	2025-06-30 23:25:47.892
cmcjr6ovz000htwsrmoxsz6hs	2025-06-30	2025-06-30 23:51:57.303	\N	MASUK	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-06-30 23:51:57.311	2025-06-30 23:51:57.311
cmcjrdp3f000jtwsr0eezaxwk	2025-06-30	2025-06-30 23:57:24.164	\N	MASUK	cmc46trp000ihtwlkk9doz5ah	cmca53cvo00o5twlke9erzxzp	2025-06-30 23:57:24.171	2025-06-30 23:57:24.171
cmck70xpp002ltwsd9rf69hw7	2025-07-01	\N	2025-07-01 07:15:22.624	PULANG	cmc46trp000ihtwlkk9doz5ah	cmca53cvo00o5twlke9erzxzp	2025-07-01 07:15:22.669	2025-07-01 07:15:22.669
cmcl52wom002ttwsdj0q9ceo7	2025-07-01	2025-07-01 23:08:41.57	\N	MASUK	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-07-01 23:08:41.586	2025-07-01 23:08:41.586
cmcl6737a002vtwsdgcwjnyq1	2025-07-01	2025-07-01 23:39:56.273	\N	MASUK	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-07-01 23:39:56.278	2025-07-01 23:39:56.278
cmcliycsy004ntwsd3v57470t	2025-07-02	\N	2025-07-02 05:37:03.821	PULANG	cmc46pdme001utwlksga35tj7	cmck41lu4001gtwsdh9n41hyu	2025-07-02 05:37:03.827	2025-07-02 05:37:03.827
cmclnlyr10061twsdti7uvjfp	2025-07-02	\N	2025-07-02 07:47:23.817	PULANG	cmc46pmrj0035twlkiohdnxpz	cmck41lu4001gtwsdh9n41hyu	2025-07-02 07:47:23.821	2025-07-02 07:47:23.821
cmclnn0az0063twsdfr8cpxi6	2025-07-02	\N	2025-07-02 07:48:12.487	PULANG	cmc46pjq9002ptwlkdlsbonh2	cmck41lu4001gtwsdh9n41hyu	2025-07-02 07:48:12.491	2025-07-02 07:48:12.491
cmclnzlps0065twsdh5ox5j2a	2025-07-02	\N	2025-07-02 07:58:00.108	PULANG	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-07-02 07:58:00.112	2025-07-02 07:58:00.112
cmclnzuev0067twsd4l1767x0	2025-07-02	\N	2025-07-02 07:58:11.379	PULANG	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-07-02 07:58:11.383	2025-07-02 07:58:11.383
cmclo1buf006btwsdcfns4vrd	2025-07-02	\N	2025-07-02 07:59:20.628	PULANG	cmc46ryle00bztwlkx7awij04	cmck3zuvk0010twsdkc3xecuu	2025-07-02 07:59:20.631	2025-07-02 07:59:20.631
cmclp8y320079twsd0hjyiuhk	2025-07-02	\N	2025-07-02 08:33:15.658	PULANG	cmc46siu100e0twlksoir3qyk	cmck3zuvk0010twsdkc3xecuu	2025-07-02 08:33:15.662	2025-07-02 08:33:15.662
cmcmkfn0d008ftwsdshaqj5gt	2025-07-02	2025-07-02 23:06:15.993	\N	MASUK	cmc46uzp400mttwlk0oazh0s3	cmck401eu0012twsds1qwqjw4	2025-07-02 23:06:15.998	2025-07-02 23:06:15.998
cmcmkh4jk008htwsdeqppbprm	2025-07-02	2025-07-02 23:07:25.373	\N	MASUK	cmc46p6jo000ttwlkjoqzjw5q	cmck41lu4001gtwsdh9n41hyu	2025-07-02 23:07:25.376	2025-07-02 23:07:25.376
cmcmkh6e6008jtwsdd0nvav7d	2025-07-02	2025-07-02 23:07:27.771	\N	MASUK	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-07-02 23:07:27.774	2025-07-02 23:07:27.774
cmcmkkooy008ltwsd75027bzb	2025-07-02	2025-07-02 23:10:11.456	\N	MASUK	cmc46pjq9002ptwlkdlsbonh2	cmck41lu4001gtwsdh9n41hyu	2025-07-02 23:10:11.459	2025-07-02 23:10:11.459
cmcmky8kp008ptwsd1jhaedrx	2025-07-02	2025-07-02 23:20:43.748	\N	MASUK	cmc46t12y00fptwlkqbiheqi2	cmck3xw5t000qtwsdwrv2o0ua	2025-07-02 23:20:43.753	2025-07-02 23:20:43.753
cmcmkyrtl008rtwsd3w2mr7rd	2025-07-02	2025-07-02 23:21:08.693	\N	MASUK	cmc46trp000ihtwlkk9doz5ah	cmca53cvo00o5twlke9erzxzp	2025-07-02 23:21:08.697	2025-07-02 23:21:08.697
cmcml4et9008ttwsd101f1oix	2025-07-02	2025-07-02 23:25:31.768	\N	MASUK	cmc46tn5q00hytwlknc1ofewc	cmck3xw5t000qtwsdwrv2o0ua	2025-07-02 23:25:31.773	2025-07-02 23:25:31.773
cmcml6uej008vtwsd3rwgun1m	2025-07-02	2025-07-02 23:27:25.288	\N	MASUK	cmc46pdme001utwlksga35tj7	cmck41lu4001gtwsdh9n41hyu	2025-07-02 23:27:25.291	2025-07-02 23:27:25.291
cmcml8v4f008xtwsdqiqmwgg6	2025-07-02	2025-07-02 23:28:59.533	\N	MASUK	cmc46siu100e0twlksoir3qyk	cmck3zuvk0010twsdkc3xecuu	2025-07-02 23:28:59.535	2025-07-02 23:28:59.535
cmcml8w4j008ztwsduwobf1bt	2025-07-02	2025-07-02 23:29:00.833	\N	MASUK	cmc46s59s00cqtwlkc8385tg3	cmck3zuvk0010twsdkc3xecuu	2025-07-02 23:29:00.835	2025-07-02 23:29:00.835
cmcml8w900091twsdsmyv6m22	2025-07-02	2025-07-02 23:29:00.992	\N	MASUK	cmc46s9u700d3twlkxxrzmirt	cmck3zuvk0010twsdkc3xecuu	2025-07-02 23:29:00.996	2025-07-02 23:29:00.996
cmcml99tx0093twsdkxzcp4nc	2025-07-02	2025-07-02 23:29:18.594	\N	MASUK	cmc46ryle00bztwlkx7awij04	cmck3zuvk0010twsdkc3xecuu	2025-07-02 23:29:18.597	2025-07-02 23:29:18.597
cmcmlcnya0095twsdprajeavp	2025-07-02	2025-07-02 23:31:56.863	\N	MASUK	cmc46pmrj0035twlkiohdnxpz	cmck41lu4001gtwsdh9n41hyu	2025-07-02 23:31:56.867	2025-07-02 23:31:56.867
cmcmljlq00099twsdkexaudvt	2025-07-02	2025-07-02 23:37:20.563	\N	MASUK	cmc46s31000cdtwlkt2zewnu5	cmck413cb001ctwsddb4r6abm	2025-07-02 23:37:20.569	2025-07-02 23:37:20.569
cmcmljqbh009btwsd8kw7r17x	2025-07-02	2025-07-02 23:37:26.522	\N	MASUK	cmc46udog00kltwlk8mp3jpsw	cmck3xw5t000qtwsdwrv2o0ua	2025-07-02 23:37:26.525	2025-07-02 23:37:26.525
cmcmlnsgb009ftwsdbffyvde2	2025-07-02	2025-07-02 23:40:35.911	\N	MASUK	cmc46r5k40091twlkc6d32ylm	cmck0qlgg0008twsdeysp7xwp	2025-07-02 23:40:35.916	2025-07-02 23:40:35.916
cmcmlogne009htwsdyakos9to	2025-07-02	2025-07-02 23:41:07.271	\N	MASUK	cmc46qnhi007atwlkoshg5ob4	cmck0qlgg0008twsdeysp7xwp	2025-07-02 23:41:07.275	2025-07-02 23:41:07.275
cmcmltkpx009jtwsdsroblg1x	2025-07-02	2025-07-02 23:45:05.824	\N	MASUK	cmc46ubh400ketwlkkfu8nopc	cmck401eu0012twsds1qwqjw4	2025-07-02 23:45:05.829	2025-07-02 23:45:05.829
cmcmm7r4e009ltwsd1t839u4f	2025-07-02	2025-07-02 23:56:07.305	\N	MASUK	cmc46v8mu00nrtwlkm3c62zp1	cmck3xw5t000qtwsdwrv2o0ua	2025-07-02 23:56:07.31	2025-07-02 23:56:07.31
cmcmmj4ov009rtwsda2v3xaan	2025-07-03	2025-07-03 00:04:58.105	\N	MASUK	cmc46tkyl00hrtwlkewcqik62	cmck0tens000atwsdmwj9xk2w	2025-07-03 00:04:58.111	2025-07-03 00:04:58.111
cmcmmouqa00a3twsddrjzpyuh	2025-07-03	2025-07-03 00:09:25.134	\N	MASUK	cmc46pq1s003ltwlkhuevqi62	cmck44fxi0022twsdqewf2qfz	2025-07-03 00:09:25.138	2025-07-03 00:09:25.138
cmcmmsfs400a7twsdz3aghp60	2025-07-03	2025-07-03 00:12:12.383	\N	MASUK	cmc46pyy9004ttwlkurhcszen	cmck40cr50016twsdir1pcyun	2025-07-03 00:12:12.388	2025-07-03 00:12:12.388
cmcmmsgtk00a9twsdpanj7ehk	2025-07-03	2025-07-03 00:12:13.732	\N	MASUK	cmc46pxyb004ptwlk2lkmy29h	cmck40cr50016twsdir1pcyun	2025-07-03 00:12:13.736	2025-07-03 00:12:13.736
cmcmmxx4300abtwsdpsoqbhil	2025-07-03	2025-07-03 00:16:28.128	\N	MASUK	cmc46r137008ntwlk9lsvz5md	cmck40cr50016twsdir1pcyun	2025-07-03 00:16:28.131	2025-07-03 00:16:28.131
cmcmnq20u00aftwsduep8a1i2	2025-07-03	2025-07-03 00:38:20.857	\N	MASUK	cmc46rndz00awtwlkmxzfjiix	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 00:38:20.863	2025-07-03 00:38:20.863
cmcmnqhqr00ahtwsd701w1e03	2025-07-03	2025-07-03 00:38:41.233	\N	MASUK	cmc46q7m6005qtwlksgmx27n4	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 00:38:41.236	2025-07-03 00:38:41.236
cmcmnrcrb00altwsd8z865vbp	2025-07-03	2025-07-03 00:39:21.428	\N	MASUK	cmc46qs78007qtwlkv76qqm1t	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 00:39:21.431	2025-07-03 00:39:21.431
cmcmnutz000artwsd36d4e298	2025-07-03	2025-07-03 00:42:03.705	\N	MASUK	cmc46p6zu000wtwlk8cv819k1	cmck58yj9002itwsdcqhqroi1	2025-07-03 00:42:03.709	2025-07-03 00:42:03.709
cmcmo7lyn00aztwsd4jw4eno3	2025-07-03	2025-07-03 00:51:59.85	\N	MASUK	cmc46qgrp006ltwlkgmd3zvcp	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 00:51:59.855	2025-07-03 00:51:59.855
cmcmoaw3400b3twsdvgzqncxd	2025-07-03	2025-07-03 00:54:32.941	\N	MASUK	cmc46qwna0089twlkok4h7czv	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 00:54:32.945	2025-07-03 00:54:32.945
cmcmoep8x00b5twsdptygtkyu	2025-07-03	2025-07-03 00:57:30.701	\N	MASUK	cmc46qlb20073twlkwsk9yxzh	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 00:57:30.705	2025-07-03 00:57:30.705
cmcmoh9fj00b7twsdlizn2oei	2025-07-03	2025-07-03 00:59:30.167	\N	MASUK	cmc46qyuo008gtwlkpfrhsk5a	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 00:59:30.175	2025-07-03 00:59:30.175
cmcmohr4300bbtwsdd3jzlpx7	2025-07-03	2025-07-03 00:59:53.087	\N	MASUK	cmc46sc4a00datwlklba5fy78	cmck435iu001stwsdbk5h55wi	2025-07-03 00:59:53.091	2025-07-03 00:59:53.091
cmcmoyh4900bftwsdptnc6d6p	2025-07-03	2025-07-03 01:12:53.283	\N	MASUK	cmc46qeik006etwlk22jwlw57	cmck42pk6001otwsdlv11onid	2025-07-03 01:12:53.289	2025-07-03 01:12:53.289
cmcmoz7yr00bhtwsds0psyyay	2025-07-03	2025-07-03 01:13:28.078	\N	MASUK	cmc46qufe007xtwlk6y6ld8k6	cmck42pk6001otwsdlv11onid	2025-07-03 01:13:28.083	2025-07-03 01:13:28.083
cmcmp4ydz00bntwsd6ba1e2zx	2025-07-03	2025-07-03 01:17:55.602	\N	MASUK	cmc46pque003ptwlkz4fc44v0	cmck0hr8y0002twsd7q1cw7g8	2025-07-03 01:17:55.608	2025-07-03 01:17:55.608
cmcmpai4e00brtwsdnqvea29i	2025-07-03	2025-07-03 01:22:14.458	\N	MASUK	cmc46r7ti009dtwlkxkev0j8x	cmck40i2v0018twsdmoshgxtd	2025-07-03 01:22:14.462	2025-07-03 01:22:14.462
cmcmpatca00bttwsdjfmuxsd5	2025-07-03	2025-07-03 01:22:29	\N	MASUK	cmc46r3af008utwlkutramzmy	cmck40i2v0018twsdmoshgxtd	2025-07-03 01:22:29.003	2025-07-03 01:22:29.003
cmcmpb0nv00bvtwsdrzl483k1	2025-07-03	2025-07-03 01:22:38.488	\N	MASUK	cmc46qj48006wtwlkxjg53s62	cmck40i2v0018twsdmoshgxtd	2025-07-03 01:22:38.492	2025-07-03 01:22:38.492
cmcmpi1l900c1twsdlwwklkdk	2025-07-03	2025-07-03 01:28:06.28	\N	MASUK	cmc46rwds00bstwlkvna2msl2	cmck0qlgg0008twsdeysp7xwp	2025-07-03 01:28:06.285	2025-07-03 01:28:06.285
cmcmpiqfn00c3twsdvjztqodl	2025-07-03	2025-07-03 01:28:38.467	\N	MASUK	cmc46qc9w0067twlkcuynnxtk	cmck0qlgg0008twsdeysp7xwp	2025-07-03 01:28:38.482	2025-07-03 01:28:38.482
cmcmpn64000c5twsdf8o7sbpj	2025-07-03	2025-07-03 01:32:05.42	\N	MASUK	cmc46sl0j00e7twlkracec5rj	cmck0qlgg0008twsdeysp7xwp	2025-07-03 01:32:05.424	2025-07-03 01:32:05.424
cmcmq2sqv00c9twsdxlg3b687	2025-07-03	2025-07-03 01:44:14.587	\N	MASUK	cmc46rgo400a5twlk8xzlphlx	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 01:44:14.599	2025-07-03 01:44:14.599
cmcmq602t00chtwsdlg3wvzyt	2025-07-03	2025-07-03 01:46:44.062	\N	MASUK	cmc46ra3i009ktwlk4kxhy7zp	cmck418fo001etwsdhf12cdrj	2025-07-03 01:46:44.069	2025-07-03 01:46:44.069
cmcmq6oq200cjtwsd2e904lvv	2025-07-03	2025-07-03 01:47:16.004	\N	MASUK	cmc46q5ev005jtwlkm0nl2m8g	cmck418fo001etwsdhf12cdrj	2025-07-03 01:47:16.01	2025-07-03 01:47:16.01
cmcn2clte00ebtwsdfjxeoqg2	2025-07-03	\N	2025-07-03 07:27:47.557	PULANG	cmc46ra3i009ktwlk4kxhy7zp	cmck418fo001etwsdhf12cdrj	2025-07-03 07:27:47.57	2025-07-03 07:27:47.57
cmcn2d90t00edtwsd0rnr85nh	2025-07-03	\N	2025-07-03 07:28:17.641	PULANG	cmc46q5ev005jtwlkm0nl2m8g	cmck418fo001etwsdhf12cdrj	2025-07-03 07:28:17.645	2025-07-03 07:28:17.645
cmcn2uqbs00ejtwsdmp2ygxth	2025-07-03	\N	2025-07-03 07:41:53.217	PULANG	cmc46p6jo000ttwlkjoqzjw5q	cmck41lu4001gtwsdh9n41hyu	2025-07-03 07:41:53.224	2025-07-03 07:41:53.224
cmcn3bpu800entwsd34kckbgi	2025-07-03	\N	2025-07-03 07:55:05.738	PULANG	cmc46qeik006etwlk22jwlw57	cmck42pk6001otwsdlv11onid	2025-07-03 07:55:05.744	2025-07-03 07:55:05.744
cmcn3c0lu00eptwsdo6xd658a	2025-07-03	\N	2025-07-03 07:55:19.696	PULANG	cmc46qufe007xtwlk6y6ld8k6	cmck42pk6001otwsdlv11onid	2025-07-03 07:55:19.699	2025-07-03 07:55:19.699
cmcn3dm0u00ertwsdc2oegl5x	2025-07-03	\N	2025-07-03 07:56:34.107	PULANG	cmc46p6zu000wtwlk8cv819k1	cmck58yj9002itwsdcqhqroi1	2025-07-03 07:56:34.11	2025-07-03 07:56:34.11
cmcn3jo5f00ettwsdg9auycd3	2025-07-03	\N	2025-07-03 08:01:16.799	PULANG	cmc46rwds00bstwlkvna2msl2	cmck0qlgg0008twsdeysp7xwp	2025-07-03 08:01:16.803	2025-07-03 08:01:16.803
cmcn3jul800evtwsdxb0thlqx	2025-07-03	\N	2025-07-03 08:01:25.144	PULANG	cmc46qwna0089twlkok4h7czv	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 08:01:25.148	2025-07-03 08:01:25.148
cmcn3k0mg00extwsdyrmuy0ne	2025-07-03	\N	2025-07-03 08:01:32.965	PULANG	cmc46qc9w0067twlkcuynnxtk	cmck0qlgg0008twsdeysp7xwp	2025-07-03 08:01:32.969	2025-07-03 08:01:32.969
cmcn3k7n900f1twsdj64s6as6	2025-07-03	\N	2025-07-03 08:01:42.067	PULANG	cmc46rndz00awtwlkmxzfjiix	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 08:01:42.07	2025-07-03 08:01:42.07
cmcn3kclc00f3twsdq6ges46g	2025-07-03	\N	2025-07-03 08:01:48.478	PULANG	cmc46qlb20073twlkwsk9yxzh	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 08:01:48.481	2025-07-03 08:01:48.481
cmcn3kmcu00f5twsdk274n50r	2025-07-03	\N	2025-07-03 08:02:01.132	PULANG	cmc46qyuo008gtwlkpfrhsk5a	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 08:02:01.134	2025-07-03 08:02:01.134
cmcn3ltkb00f9twsd0a039age	2025-07-03	\N	2025-07-03 08:02:57.129	PULANG	cmc46tkyl00hrtwlkewcqik62	cmck0tens000atwsdmwj9xk2w	2025-07-03 08:02:57.132	2025-07-03 08:02:57.132
cmcn3mm7r00fdtwsd01fxy97i	2025-07-03	\N	2025-07-03 08:03:34.259	PULANG	cmc46q7m6005qtwlksgmx27n4	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 08:03:34.263	2025-07-03 08:03:34.263
cmcn3mob600fftwsdai9k66u5	2025-07-03	\N	2025-07-03 08:03:36.976	PULANG	cmc46r7ti009dtwlkxkev0j8x	cmck40i2v0018twsdmoshgxtd	2025-07-03 08:03:36.979	2025-07-03 08:03:36.979
cmcn3mqj100fhtwsdm0nbz442	2025-07-03	\N	2025-07-03 08:03:39.85	PULANG	cmc46sl0j00e7twlkracec5rj	cmck0qlgg0008twsdeysp7xwp	2025-07-03 08:03:39.853	2025-07-03 08:03:39.853
cmcn3n3dt00fjtwsdvqw4zpkr	2025-07-03	\N	2025-07-03 08:03:56.509	PULANG	cmc46r3af008utwlkutramzmy	cmck40i2v0018twsdmoshgxtd	2025-07-03 08:03:56.513	2025-07-03 08:03:56.513
cmcn3ntmw00fltwsd19j1uf8s	2025-07-03	\N	2025-07-03 08:04:30.533	PULANG	cmc46s31000cdtwlkt2zewnu5	cmck413cb001ctwsddb4r6abm	2025-07-03 08:04:30.536	2025-07-03 08:04:30.536
cmcn3oglg00fptwsdp6kd7udd	2025-07-03	\N	2025-07-03 08:05:00.289	PULANG	cmc46qs78007qtwlkv76qqm1t	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 08:05:00.293	2025-07-03 08:05:00.293
cmcn3ouif00frtwsdry9ukn0h	2025-07-03	\N	2025-07-03 08:05:18.324	PULANG	cmc46qj48006wtwlkxjg53s62	cmck40i2v0018twsdmoshgxtd	2025-07-03 08:05:18.327	2025-07-03 08:05:18.327
cmcn3par100fttwsdxl4moo5i	2025-07-03	\N	2025-07-03 08:05:39.371	PULANG	cmc46qnhi007atwlkoshg5ob4	cmck0qlgg0008twsdeysp7xwp	2025-07-03 08:05:39.373	2025-07-03 08:05:39.373
cmcn3pqw800fxtwsd3z182ocz	2025-07-03	\N	2025-07-03 08:06:00.294	PULANG	cmc46r5k40091twlkc6d32ylm	cmck0qlgg0008twsdeysp7xwp	2025-07-03 08:06:00.296	2025-07-03 08:06:00.296
cmcn3qrl100fztwsd1c3dilba	2025-07-03	\N	2025-07-03 08:06:47.842	PULANG	cmc46rgo400a5twlk8xzlphlx	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 08:06:47.845	2025-07-03 08:06:47.845
cmcn3sb7900g3twsdrjtqsl83	2025-07-03	\N	2025-07-03 08:07:59.921	PULANG	cmc46qgrp006ltwlkgmd3zvcp	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 08:07:59.925	2025-07-03 08:07:59.925
cmcn3x4y500g7twsdl8dhenab	2025-07-03	\N	2025-07-03 08:11:45.097	PULANG	cmc46s59s00cqtwlkc8385tg3	cmck3zuvk0010twsdkc3xecuu	2025-07-03 08:11:45.101	2025-07-03 08:11:45.101
cmcn402ml00g9twsdgbqa7koy	2025-07-03	\N	2025-07-03 08:14:02.057	PULANG	cmc46s9u700d3twlkxxrzmirt	cmck3zuvk0010twsdkc3xecuu	2025-07-03 08:14:02.061	2025-07-03 08:14:02.061
cmcn55q4n00gjtwsdqfsj0hq0	2025-07-03	\N	2025-07-03 08:46:25.411	PULANG	cmc46qpxp007jtwlkmf7x9mjw	cmck42pk6001otwsdlv11onid	2025-07-03 08:46:25.415	2025-07-03 08:46:25.415
cmcnztj7d00hntwsd2fm1sf4a	2025-07-03	2025-07-03 23:04:44.645	\N	MASUK	cmc46p6jo000ttwlkjoqzjw5q	cmck41lu4001gtwsdh9n41hyu	2025-07-03 23:04:44.654	2025-07-03 23:04:44.654
cmcnzu2u400hptwsdethjdwzn	2025-07-03	2025-07-03 23:05:10.106	\N	MASUK	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-07-03 23:05:10.109	2025-07-03 23:05:10.109
cmcnzuufp00hrtwsdj1d6f5nq	2025-07-03	2025-07-03 23:05:45.874	\N	MASUK	cmc46pmrj0035twlkiohdnxpz	cmck41lu4001gtwsdh9n41hyu	2025-07-03 23:05:45.877	2025-07-03 23:05:45.877
cmcnzvkak00httwsd9oudfpmh	2025-07-03	2025-07-03 23:06:19.385	\N	MASUK	cmc46pdme001utwlksga35tj7	cmck41lu4001gtwsdh9n41hyu	2025-07-03 23:06:19.389	2025-07-03 23:06:19.389
cmcnzvkhj00hvtwsdiyl2ayxd	2025-07-03	2025-07-03 23:06:19.635	\N	MASUK	cmc46pjq9002ptwlkdlsbonh2	cmck41lu4001gtwsdh9n41hyu	2025-07-03 23:06:19.639	2025-07-03 23:06:19.639
cmcnzwt6j00hxtwsd6vifg1jv	2025-07-03	2025-07-03 23:07:17.56	\N	MASUK	cmc46ryle00bztwlkx7awij04	cmck3zuvk0010twsdkc3xecuu	2025-07-03 23:07:17.563	2025-07-03 23:07:17.563
cmcnzycle00hztwsdqymwwz0v	2025-07-03	2025-07-03 23:08:29.374	\N	MASUK	cmc46siu100e0twlksoir3qyk	cmck3zuvk0010twsdkc3xecuu	2025-07-03 23:08:29.378	2025-07-03 23:08:29.378
cmco0gzoy00i3twsdq94c9552	2025-07-03	2025-07-03 23:22:59.118	\N	MASUK	cmc46s9u700d3twlkxxrzmirt	cmck3zuvk0010twsdkc3xecuu	2025-07-03 23:22:59.122	2025-07-03 23:22:59.122
cmco0huv500i5twsdwpbql7zr	2025-07-03	2025-07-03 23:23:39.519	\N	MASUK	cmc46s59s00cqtwlkc8385tg3	cmck3zuvk0010twsdkc3xecuu	2025-07-03 23:23:39.521	2025-07-03 23:23:39.521
cmco117cv00i7twsdt7efjglj	2025-07-03	2025-07-03 23:38:42.171	\N	MASUK	cmc46s31000cdtwlkt2zewnu5	cmck413cb001ctwsddb4r6abm	2025-07-03 23:38:42.175	2025-07-03 23:38:42.175
cmco16lam00i9twsdpiwda9r2	2025-07-03	2025-07-03 23:42:53.516	\N	MASUK	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-07-03 23:42:53.518	2025-07-03 23:42:53.518
cmco1hv8600ibtwsdlzac92lf	2025-07-03	2025-07-03 23:51:39.602	\N	MASUK	cmc46v8mu00nrtwlkm3c62zp1	cmck3xw5t000qtwsdwrv2o0ua	2025-07-03 23:51:39.607	2025-07-03 23:51:39.607
cmco1wfku00idtwsd291eez7b	2025-07-04	2025-07-04 00:02:59.163	\N	MASUK	cmc46ubh400ketwlkkfu8nopc	cmck401eu0012twsds1qwqjw4	2025-07-04 00:02:59.166	2025-07-04 00:02:59.166
cmco1wx7900iftwsdzqan11lx	2025-07-04	2025-07-04 00:03:22.002	\N	MASUK	cmc46uzp400mttwlk0oazh0s3	cmck401eu0012twsds1qwqjw4	2025-07-04 00:03:22.005	2025-07-04 00:03:22.005
cmco1ytw700ihtwsdk0h288z5	2025-07-04	2025-07-04 00:04:51.028	\N	MASUK	cmc46tn5q00hytwlknc1ofewc	cmck3xw5t000qtwsdwrv2o0ua	2025-07-04 00:04:51.031	2025-07-04 00:04:51.031
cmco1yyvs00ijtwsdt9zmggwo	2025-07-04	2025-07-04 00:04:57.492	\N	MASUK	cmc46t12y00fptwlkqbiheqi2	cmck3xw5t000qtwsdwrv2o0ua	2025-07-04 00:04:57.495	2025-07-04 00:04:57.495
cmco1z80800iltwsdi1r4u3rv	2025-07-04	2025-07-04 00:05:09.317	\N	MASUK	cmc46udog00kltwlk8mp3jpsw	cmck3xw5t000qtwsdwrv2o0ua	2025-07-04 00:05:09.32	2025-07-04 00:05:09.32
cmco20jwm00intwsd2bke1lif	2025-07-04	2025-07-04 00:06:11.395	\N	MASUK	cmc46r5k40091twlkc6d32ylm	cmck0qlgg0008twsdeysp7xwp	2025-07-04 00:06:11.398	2025-07-04 00:06:11.398
cmco21xt800iptwsd5t5x32ou	2025-07-04	2025-07-04 00:07:16.073	\N	MASUK	cmc46qnhi007atwlkoshg5ob4	cmck0qlgg0008twsdeysp7xwp	2025-07-04 00:07:16.076	2025-07-04 00:07:16.076
cmco2nyc900j5twsd5yheepsh	2025-07-04	2025-07-04 00:24:23.187	\N	MASUK	cmc46p5ql000ntwlkqrw64rf6	cmc48mero00nvtwlko7dnse2m	2025-07-04 00:24:23.194	2025-07-04 00:24:23.194
cmco2ojlg00j7twsd9kdcjshx	2025-07-04	2025-07-04 00:24:50.737	\N	MASUK	cmc46p7y00012twlkan1t901y	cmc48mero00nvtwlko7dnse2m	2025-07-04 00:24:50.74	2025-07-04 00:24:50.74
cmco2q7de00j9twsd48krzzff	2025-07-04	2025-07-04 00:26:08.208	\N	MASUK	cmc46pwha004itwlkuzsyazgn	cmc48mero00nvtwlko7dnse2m	2025-07-04 00:26:08.21	2025-07-04 00:26:08.21
cmco2qm4000jbtwsd72l8ruws	2025-07-04	2025-07-04 00:26:27.308	\N	MASUK	cmc46poab003dtwlkkkqtlmi4	cmc48mero00nvtwlko7dnse2m	2025-07-04 00:26:27.312	2025-07-04 00:26:27.312
cmco4h4qj00jftwsdhfr12a1p	2025-07-04	2025-07-04 01:15:04.119	\N	MASUK	cmc46uopi00lutwlk6ky20hrv	cmck406q40014twsd4gqd9j1a	2025-07-04 01:15:04.123	2025-07-04 01:15:04.123
cmco4hcev00jhtwsdh5d0thd2	2025-07-04	2025-07-04 01:15:14.069	\N	MASUK	cmc46trp000ihtwlkk9doz5ah	cmca53cvo00o5twlke9erzxzp	2025-07-04 01:15:14.071	2025-07-04 01:15:14.071
cmco4ilb200jjtwsdq42urqir	2025-07-04	2025-07-04 01:16:12.251	\N	MASUK	cmc46swpg00fetwlkx51xpyx3	cmck406q40014twsd4gqd9j1a	2025-07-04 01:16:12.254	2025-07-04 01:16:12.254
cmco4k96600jltwsdh27b04we	2025-07-04	2025-07-04 01:17:29.835	\N	MASUK	cmc46v45w00ndtwlk563qy6nd	cmck406q40014twsd4gqd9j1a	2025-07-04 01:17:29.839	2025-07-04 01:17:29.839
cmco4lff700jntwsdvohipt6b	2025-07-04	2025-07-04 01:18:24.593	\N	MASUK	cmc46sufy00f1twlkyabfajk9	cmck406q40014twsd4gqd9j1a	2025-07-04 01:18:24.595	2025-07-04 01:18:24.595
cmcoghcr100kptwsdlhujboli	2025-07-04	\N	2025-07-04 06:51:09.897	PULANG	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-07-04 06:51:09.902	2025-07-04 06:51:09.902
cmcogj2xh00krtwsdcwklfc0b	2025-07-04	\N	2025-07-04 06:52:30.481	PULANG	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-07-04 06:52:30.485	2025-07-04 06:52:30.485
cmcogkctv00kvtwsddr2h8ln3	2025-07-04	\N	2025-07-04 06:53:29.967	PULANG	cmc46pmrj0035twlkiohdnxpz	cmck41lu4001gtwsdh9n41hyu	2025-07-04 06:53:29.971	2025-07-04 06:53:29.971
cmcogldfd00l1twsdkxsvx8ih	2025-07-04	\N	2025-07-04 06:54:17.394	PULANG	cmc46pjq9002ptwlkdlsbonh2	cmck41lu4001gtwsdh9n41hyu	2025-07-04 06:54:17.401	2025-07-04 06:54:17.401
cmcogpb9o00l7twsd8hiu9fja	2025-07-04	\N	2025-07-04 06:57:21.225	PULANG	cmc46ryle00bztwlkx7awij04	cmck3zuvk0010twsdkc3xecuu	2025-07-04 06:57:21.228	2025-07-04 06:57:21.228
cmcogxir100lftwsdxggjpjc3	2025-07-04	\N	2025-07-04 07:03:44.17	PULANG	cmc46siu100e0twlksoir3qyk	cmck3zuvk0010twsdkc3xecuu	2025-07-04 07:03:44.173	2025-07-04 07:03:44.173
cmcoiz42d00lptwsd02qjd3j8	2025-07-04	\N	2025-07-04 08:00:57.677	PULANG	cmc46sc4a00datwlklba5fy78	cmck435iu001stwsdbk5h55wi	2025-07-04 08:00:57.685	2025-07-04 08:00:57.685
cmcoj4m1x00lrtwsdvcohcdgo	2025-07-04	\N	2025-07-04 08:05:14.271	PULANG	cmc46p5ql000ntwlkqrw64rf6	cmc48mero00nvtwlko7dnse2m	2025-07-04 08:05:14.277	2025-07-04 08:05:14.277
cmcoj621k00lttwsd4gbl21w0	2025-07-04	\N	2025-07-04 08:06:21.654	PULANG	cmc46trp000ihtwlkk9doz5ah	cmca53cvo00o5twlke9erzxzp	2025-07-04 08:06:21.657	2025-07-04 08:06:21.657
cmcoj6y1600lvtwsd3mhglepn	2025-07-04	\N	2025-07-04 08:07:03.111	PULANG	cmc46poab003dtwlkkkqtlmi4	cmc48mero00nvtwlko7dnse2m	2025-07-04 08:07:03.114	2025-07-04 08:07:03.114
cmcojtys400lxtwsd3x7vdjhe	2025-07-04	\N	2025-07-04 08:24:57.166	PULANG	cmc46p7y00012twlkan1t901y	cmc48mero00nvtwlko7dnse2m	2025-07-04 08:24:57.172	2025-07-04 08:24:57.172
cmcokgfh600lztwsdmwn7kb0d	2025-07-04	\N	2025-07-04 08:42:25.239	PULANG	cmc46v8mu00nrtwlkm3c62zp1	cmck3xw5t000qtwsdwrv2o0ua	2025-07-04 08:42:25.243	2025-07-04 08:42:25.243
cmcokgi9800m1twsdfy8dtd9r	2025-07-04	\N	2025-07-04 08:42:28.84	PULANG	cmc46udog00kltwlk8mp3jpsw	cmck3xw5t000qtwsdwrv2o0ua	2025-07-04 08:42:28.844	2025-07-04 08:42:28.844
cmcokgxns00m5twsdbqd8oyok	2025-07-04	\N	2025-07-04 08:42:48.805	PULANG	cmc46tn5q00hytwlknc1ofewc	cmck3xw5t000qtwsdwrv2o0ua	2025-07-04 08:42:48.809	2025-07-04 08:42:48.809
cmcokj4dr00mntwsdmx0l9vm2	2025-07-04	\N	2025-07-04 08:44:30.828	PULANG	cmc46pwha004itwlkuzsyazgn	cmc48mero00nvtwlko7dnse2m	2025-07-04 08:44:30.832	2025-07-04 08:44:30.832
cmcsabfcw00nztwsdm5e9yrpc	2025-07-06	2025-07-06 23:09:40.263	\N	MASUK	cmc46p6jo000ttwlkjoqzjw5q	cmck41lu4001gtwsdh9n41hyu	2025-07-06 23:09:40.346	2025-07-06 23:09:40.346
cmcsadycs00o1twsd1adp2yk9	2025-07-06	2025-07-06 23:11:38.281	\N	MASUK	cmc46pjq9002ptwlkdlsbonh2	cmck41lu4001gtwsdh9n41hyu	2025-07-06 23:11:38.285	2025-07-06 23:11:38.285
cmcsafltr00o3twsdgtk64k8m	2025-07-06	2025-07-06 23:12:55.356	\N	MASUK	cmc46pmrj0035twlkiohdnxpz	cmck41lu4001gtwsdh9n41hyu	2025-07-06 23:12:55.359	2025-07-06 23:12:55.359
cmcsajtg000o5twsdey1qx7ii	2025-07-06	2025-07-06 23:16:11.85	\N	MASUK	cmc46siu100e0twlksoir3qyk	cmck3zuvk0010twsdkc3xecuu	2025-07-06 23:16:11.856	2025-07-06 23:16:11.856
cmcsalhrk00o7twsdgsnyd03s	2025-07-06	2025-07-06 23:17:30.029	\N	MASUK	cmc46ryle00bztwlkx7awij04	cmck3zuvk0010twsdkc3xecuu	2025-07-06 23:17:30.033	2025-07-06 23:17:30.033
cmcsaprzw00o9twsdjpw0k1ho	2025-07-06	2025-07-06 23:20:49.913	\N	MASUK	cmc46sneu00eetwlk7gnrmbf8	cmck3zuvk0010twsdkc3xecuu	2025-07-06 23:20:49.916	2025-07-06 23:20:49.916
cmcsax2n200obtwsd4ylumivk	2025-07-06	2025-07-06 23:26:30.294	\N	MASUK	cmc46s59s00cqtwlkc8385tg3	cmck3zuvk0010twsdkc3xecuu	2025-07-06 23:26:30.302	2025-07-06 23:26:30.302
cmcsax4t400odtwsdrk55ndrd	2025-07-06	2025-07-06 23:26:33.109	\N	MASUK	cmc46s9u700d3twlkxxrzmirt	cmck3zuvk0010twsdkc3xecuu	2025-07-06 23:26:33.112	2025-07-06 23:26:33.112
cmcsaxzyr00oftwsdwoym7abp	2025-07-06	2025-07-06 23:27:13.486	\N	MASUK	cmc46v45w00ndtwlk563qy6nd	cmck406q40014twsd4gqd9j1a	2025-07-06 23:27:13.491	2025-07-06 23:27:13.491
cmcsaze8k00ohtwsdadpyfhek	2025-07-06	2025-07-06 23:28:18.642	\N	MASUK	cmc46swpg00fetwlkx51xpyx3	cmck406q40014twsd4gqd9j1a	2025-07-06 23:28:18.644	2025-07-06 23:28:18.644
cmcsb0htx00ojtwsd4rd86hgd	2025-07-06	2025-07-06 23:29:09.952	\N	MASUK	cmc46sufy00f1twlkyabfajk9	cmck406q40014twsd4gqd9j1a	2025-07-06 23:29:09.957	2025-07-06 23:29:09.957
cmcsb1et300oltwsdv6iy5seg	2025-07-06	2025-07-06 23:29:52.692	\N	MASUK	cmc46r5k40091twlkc6d32ylm	cmck0qlgg0008twsdeysp7xwp	2025-07-06 23:29:52.695	2025-07-06 23:29:52.695
cmcsb1q4800ontwsdi72lfp4f	2025-07-06	2025-07-06 23:30:07.349	\N	MASUK	cmc46qnhi007atwlkoshg5ob4	cmck0qlgg0008twsdeysp7xwp	2025-07-06 23:30:07.352	2025-07-06 23:30:07.352
cmcsb1umj00optwsdhfpbvsny	2025-07-06	2025-07-06 23:30:13.191	\N	MASUK	cmc46uopi00lutwlk6ky20hrv	cmck406q40014twsd4gqd9j1a	2025-07-06 23:30:13.195	2025-07-06 23:30:13.195
cmcsb34h700ortwsdxt4fsdgz	2025-07-06	2025-07-06 23:31:12.61	\N	MASUK	cmc46rwds00bstwlkvna2msl2	cmck0qlgg0008twsdeysp7xwp	2025-07-06 23:31:12.619	2025-07-06 23:31:12.619
cmcsb55nh00ottwsdy5799636	2025-07-06	2025-07-06 23:32:47.451	\N	MASUK	cmc46qc9w0067twlkcuynnxtk	cmck0qlgg0008twsdeysp7xwp	2025-07-06 23:32:47.454	2025-07-06 23:32:47.454
cmcsb6chj00ovtwsdnrfytlkr	2025-07-06	2025-07-06 23:33:42.964	\N	MASUK	cmc46p7y00012twlkan1t901y	cmc48mero00nvtwlko7dnse2m	2025-07-06 23:33:42.967	2025-07-06 23:33:42.967
cmcsbb85600oxtwsd551oani1	2025-07-06	2025-07-06 23:37:30.611	\N	MASUK	cmc46p5ql000ntwlkqrw64rf6	cmc48mero00nvtwlko7dnse2m	2025-07-06 23:37:30.618	2025-07-06 23:37:30.618
cmcsbc64400oztwsdencp9fz3	2025-07-06	2025-07-06 23:38:14.641	\N	MASUK	cmc46poab003dtwlkkkqtlmi4	cmc48mero00nvtwlko7dnse2m	2025-07-06 23:38:14.644	2025-07-06 23:38:14.644
cmcsbe45g00p1twsd1xqt2bc9	2025-07-06	2025-07-06 23:39:45.409	\N	MASUK	cmc46qeik006etwlk22jwlw57	cmck42pk6001otwsdlv11onid	2025-07-06 23:39:45.412	2025-07-06 23:39:45.412
cmcsbfvrg00p5twsd472nho4g	2025-07-06	2025-07-06 23:41:07.842	\N	MASUK	cmc46p64g000qtwlkv3exmjxb	cmck461f1002atwsd7hvt6jif	2025-07-06 23:41:07.853	2025-07-06 23:41:07.853
cmcsbgcdv00p7twsdkky4uyy6	2025-07-06	2025-07-06 23:41:29.393	\N	MASUK	cmc46pa83001dtwlkw34o2zus	cmck461f1002atwsd7hvt6jif	2025-07-06 23:41:29.395	2025-07-06 23:41:29.395
cmcsbgndz00p9twsdmva04v5r	2025-07-06	2025-07-06 23:41:43.649	\N	MASUK	cmc46s31000cdtwlkt2zewnu5	cmck413cb001ctwsddb4r6abm	2025-07-06 23:41:43.655	2025-07-06 23:41:43.655
cmcsbj5mu00pbtwsd79suryft	2025-07-06	2025-07-06 23:43:40.608	\N	MASUK	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-07-06 23:43:40.614	2025-07-06 23:43:40.614
cmcsbk17s00pdtwsdl9dodj1c	2025-07-06	2025-07-06 23:44:21.535	\N	MASUK	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-07-06 23:44:21.544	2025-07-06 23:44:21.544
cmcsbls0t00pftwsddd3kofu4	2025-07-06	2025-07-06 23:45:42.938	\N	MASUK	cmc46qufe007xtwlk6y6ld8k6	cmck42pk6001otwsdlv11onid	2025-07-06 23:45:42.941	2025-07-06 23:45:42.941
cmcsbqa7e00phtwsd5ov7bnzl	2025-07-06	2025-07-06 23:49:13.126	\N	MASUK	cmc46ra3i009ktwlk4kxhy7zp	cmck418fo001etwsdhf12cdrj	2025-07-06 23:49:13.131	2025-07-06 23:49:13.131
cmcsbxiks00pjtwsdh5d4a6al	2025-07-06	2025-07-06 23:54:50.568	\N	MASUK	cmc46q5ev005jtwlkm0nl2m8g	cmck418fo001etwsdhf12cdrj	2025-07-06 23:54:50.572	2025-07-06 23:54:50.572
cmcsc7swe00pltwsdgqm8t682	2025-07-07	2025-07-07 00:02:50.503	\N	MASUK	cmc46uzp400mttwlk0oazh0s3	cmck401eu0012twsds1qwqjw4	2025-07-07 00:02:50.51	2025-07-07 00:02:50.51
cmcsd0m9300pptwsdhq2ql246	2025-07-07	2025-07-07 00:25:14.915	\N	MASUK	cmc46qs78007qtwlkv76qqm1t	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 00:25:14.919	2025-07-07 00:25:14.919
cmcsd3a9t00prtwsdsrcnc8lu	2025-07-07	2025-07-07 00:27:19.359	\N	MASUK	cmc46rndz00awtwlkmxzfjiix	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 00:27:19.362	2025-07-07 00:27:19.362
cmcsd3au300pttwsdv05kcvqv	2025-07-07	2025-07-07 00:27:20.087	\N	MASUK	cmc46qyuo008gtwlkpfrhsk5a	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 00:27:20.092	2025-07-07 00:27:20.092
cmcsd3s4a00pvtwsdnrgozwbz	2025-07-07	2025-07-07 00:27:42.485	\N	MASUK	cmc46p6zu000wtwlk8cv819k1	cmck58yj9002itwsdcqhqroi1	2025-07-07 00:27:42.49	2025-07-07 00:27:42.49
cmcsd46en00pxtwsdhmlhaleu	2025-07-07	2025-07-07 00:28:01.004	\N	MASUK	cmc46qlb20073twlkwsk9yxzh	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 00:28:01.007	2025-07-07 00:28:01.007
cmcsd47wz00pztwsd3t82yjr8	2025-07-07	2025-07-07 00:28:02.96	\N	MASUK	cmc46q7m6005qtwlksgmx27n4	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 00:28:02.964	2025-07-07 00:28:02.964
cmcsd49vf00q1twsd7d3391lz	2025-07-07	2025-07-07 00:28:05.496	\N	MASUK	cmc46qwna0089twlkok4h7czv	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 00:28:05.499	2025-07-07 00:28:05.499
cmcsd59ed00q3twsdambtookx	2025-07-07	2025-07-07 00:28:51.536	\N	MASUK	cmc46rgo400a5twlk8xzlphlx	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 00:28:51.541	2025-07-07 00:28:51.541
cmcsd5uve00q5twsdnyrgl6xw	2025-07-07	2025-07-07 00:29:19.367	\N	MASUK	cmc46qgrp006ltwlkgmd3zvcp	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 00:29:19.37	2025-07-07 00:29:19.37
cmcsdcx9w00q9twsd0k4j1z7k	2025-07-07	2025-07-07 00:34:49.07	\N	MASUK	cmc46trp000ihtwlkk9doz5ah	cmca53cvo00o5twlke9erzxzp	2025-07-07 00:34:49.076	2025-07-07 00:34:49.076
cmcsdifi500qbtwsdeyaif5sh	2025-07-07	2025-07-07 00:39:05.978	\N	MASUK	cmc46sl0j00e7twlkracec5rj	cmck0qlgg0008twsdeysp7xwp	2025-07-07 00:39:05.981	2025-07-07 00:39:05.981
cmcsdnsev00qdtwsdxztmcr7l	2025-07-07	2025-07-07 00:43:15.987	\N	MASUK	cmc46v8mu00nrtwlkm3c62zp1	cmck3xw5t000qtwsdwrv2o0ua	2025-07-07 00:43:15.992	2025-07-07 00:43:15.992
cmcsehjfp00qftwsd13n96w1p	2025-07-07	2025-07-07 01:06:24.031	\N	MASUK	cmc46sc4a00datwlklba5fy78	cmck435iu001stwsdbk5h55wi	2025-07-07 01:06:24.038	2025-07-07 01:06:24.038
cmcsewymj00qltwsd6y0uk28v	2025-07-07	2025-07-07 01:18:23.558	\N	MASUK	cmc46pdme001utwlksga35tj7	cmck41lu4001gtwsdh9n41hyu	2025-07-07 01:18:23.564	2025-07-07 01:18:23.564
cmcsf40o400qrtwsd33yetmjy	2025-07-07	2025-07-07 01:23:52.797	\N	MASUK	cmc46sgjj00dttwlk2n9q1jja	cmc48n8mc00nztwlkq8l3p7ok	2025-07-07 01:23:52.804	2025-07-07 01:23:52.804
cmcsf6j9500qttwsdrb99oee1	2025-07-07	2025-07-07 01:25:50.197	\N	MASUK	cmc46udog00kltwlk8mp3jpsw	cmck3xw5t000qtwsdwrv2o0ua	2025-07-07 01:25:50.201	2025-07-07 01:25:50.201
cmcsf7bau00qvtwsd3vo4y4jp	2025-07-07	2025-07-07 01:26:26.545	\N	MASUK	cmc46tn5q00hytwlknc1ofewc	cmck3xw5t000qtwsdwrv2o0ua	2025-07-07 01:26:26.55	2025-07-07 01:26:26.55
cmcsfh3vr00qztwsdz80n2jty	2025-07-07	2025-07-07 01:34:03.49	\N	MASUK	cmc46pq1s003ltwlkhuevqi62	cmck44fxi0022twsdqewf2qfz	2025-07-07 01:34:03.495	2025-07-07 01:34:03.495
cmcspu4uj00r9twsdwrvro3sy	2025-07-07	\N	2025-07-07 06:24:07.415	PULANG	cmc46q5ev005jtwlkm0nl2m8g	cmck418fo001etwsdhf12cdrj	2025-07-07 06:24:07.435	2025-07-07 06:24:07.435
cmcss7g2j00rftwsd36ilm066	2025-07-07	\N	2025-07-07 07:30:27.733	PULANG	cmc46ra3i009ktwlk4kxhy7zp	cmck418fo001etwsdhf12cdrj	2025-07-07 07:30:27.739	2025-07-07 07:30:27.739
cmcss8c8u00rhtwsdl9bzwf80	2025-07-07	\N	2025-07-07 07:31:09.434	PULANG	cmc46qyuo008gtwlkpfrhsk5a	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 07:31:09.439	2025-07-07 07:31:09.439
cmcsse53500rptwsdlwmqu79d	2025-07-07	\N	2025-07-07 07:35:40.092	PULANG	cmc46rpmn00b3twlk3kcu7mik	cmck40wej001atwsdpzxns3dc	2025-07-07 07:35:40.097	2025-07-07 07:35:40.097
cmcssefq700rrtwsd5o5y2lmv	2025-07-07	\N	2025-07-07 07:35:53.882	PULANG	cmc46rixs00aitwlkpg86h565	cmck40wej001atwsdpzxns3dc	2025-07-07 07:35:53.887	2025-07-07 07:35:53.887
cmcsseh7e00rttwsd55s2iup5	2025-07-07	\N	2025-07-07 07:35:55.798	PULANG	cmc46pkez002ttwlknaeob0ip	cmck40wej001atwsdpzxns3dc	2025-07-07 07:35:55.803	2025-07-07 07:35:55.803
cmcssgpao00rxtwsdeuwppkw5	2025-07-07	\N	2025-07-07 07:37:39.597	PULANG	cmc46phg0002dtwlkt8tcx2ia	cmck40wej001atwsdpzxns3dc	2025-07-07 07:37:39.6	2025-07-07 07:37:39.6
cmcsshoac00rztwsdcsk08nvx	2025-07-07	\N	2025-07-07 07:38:24.945	PULANG	cmc46ped8001ytwlkfrb06txj	cmck40wej001atwsdpzxns3dc	2025-07-07 07:38:24.948	2025-07-07 07:38:24.948
cmcssu8hj00sbtwsdvghu0xhj	2025-07-07	\N	2025-07-07 07:48:10.993	PULANG	cmc46p64g000qtwlkv3exmjxb	cmck461f1002atwsd7hvt6jif	2025-07-07 07:48:11	2025-07-07 07:48:11
cmcssumer00sdtwsd1zhyecam	2025-07-07	\N	2025-07-07 07:48:29.036	PULANG	cmc46pa83001dtwlkw34o2zus	cmck461f1002atwsd7hvt6jif	2025-07-07 07:48:29.044	2025-07-07 07:48:29.044
cmcssyphb00shtwsdqc3sygs1	2025-07-07	\N	2025-07-07 07:51:39.645	PULANG	cmc46qufe007xtwlk6y6ld8k6	cmck42pk6001otwsdlv11onid	2025-07-07 07:51:39.647	2025-07-07 07:51:39.647
cmcssz06x00sjtwsdjlpj004v	2025-07-07	\N	2025-07-07 07:51:53.526	PULANG	cmc46qeik006etwlk22jwlw57	cmck42pk6001otwsdlv11onid	2025-07-07 07:51:53.529	2025-07-07 07:51:53.529
cmcst049i00sltwsd6usk521m	2025-07-07	\N	2025-07-07 07:52:45.459	PULANG	cmc46qnhi007atwlkoshg5ob4	cmck0qlgg0008twsdeysp7xwp	2025-07-07 07:52:45.462	2025-07-07 07:52:45.462
cmcst04e100sntwsd6qb9y2bv	2025-07-07	\N	2025-07-07 07:52:45.622	PULANG	cmc46qlb20073twlkwsk9yxzh	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 07:52:45.625	2025-07-07 07:52:45.625
cmcst0hok00sptwsdlewsb0tv	2025-07-07	\N	2025-07-07 07:53:02.849	PULANG	cmc46r5k40091twlkc6d32ylm	cmck0qlgg0008twsdeysp7xwp	2025-07-07 07:53:02.852	2025-07-07 07:53:02.852
cmcst0rjw00srtwsd0kdkeviq	2025-07-07	\N	2025-07-07 07:53:15.639	PULANG	cmc46qwna0089twlkok4h7czv	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 07:53:15.644	2025-07-07 07:53:15.644
cmcst2ghv00sztwsd4u7bwv0n	2025-07-07	\N	2025-07-07 07:54:34.617	PULANG	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-07-07 07:54:34.627	2025-07-07 07:54:34.627
cmcst2hls00t1twsdgpa8cus4	2025-07-07	\N	2025-07-07 07:54:36.061	PULANG	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-07-07 07:54:36.064	2025-07-07 07:54:36.064
cmcst3v7n00t3twsd8r10c1j0	2025-07-07	\N	2025-07-07 07:55:40.349	PULANG	cmc46rndz00awtwlkmxzfjiix	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 07:55:40.356	2025-07-07 07:55:40.356
cmcst5v8900t9twsd5bwaxgvk	2025-07-07	\N	2025-07-07 07:57:13.686	PULANG	cmc46ryle00bztwlkx7awij04	cmck3zuvk0010twsdkc3xecuu	2025-07-07 07:57:13.689	2025-07-07 07:57:13.689
cmcst65mg00tbtwsdrn4ykic2	2025-07-07	\N	2025-07-07 07:57:27.158	PULANG	cmc46pdme001utwlksga35tj7	cmck41lu4001gtwsdh9n41hyu	2025-07-07 07:57:27.161	2025-07-07 07:57:27.161
cmcst6iio00tdtwsd7plw6pkk	2025-07-07	\N	2025-07-07 07:57:43.866	PULANG	cmc46p6jo000ttwlkjoqzjw5q	cmck41lu4001gtwsdh9n41hyu	2025-07-07 07:57:43.872	2025-07-07 07:57:43.872
cmcst991q00tftwsd2npe45bj	2025-07-07	\N	2025-07-07 07:59:51.561	PULANG	cmc46poab003dtwlkkkqtlmi4	cmc48mero00nvtwlko7dnse2m	2025-07-07 07:59:51.567	2025-07-07 07:59:51.567
cmcst9f8l00thtwsddiqo93eo	2025-07-07	\N	2025-07-07 07:59:59.585	PULANG	cmc46sneu00eetwlk7gnrmbf8	cmck3zuvk0010twsdkc3xecuu	2025-07-07 07:59:59.589	2025-07-07 07:59:59.589
cmcst9xw300tjtwsd3ovdkis2	2025-07-07	\N	2025-07-07 08:00:23.751	PULANG	cmc46p5ql000ntwlkqrw64rf6	cmc48mero00nvtwlko7dnse2m	2025-07-07 08:00:23.763	2025-07-07 08:00:23.763
cmcsta42600tltwsdaqbflnaz	2025-07-07	\N	2025-07-07 08:00:31.756	PULANG	cmc46s31000cdtwlkt2zewnu5	cmck413cb001ctwsddb4r6abm	2025-07-07 08:00:31.759	2025-07-07 08:00:31.759
cmcstbm3400tptwsdg2n3sg2c	2025-07-07	\N	2025-07-07 08:01:41.772	PULANG	cmc46sl0j00e7twlkracec5rj	cmck0qlgg0008twsdeysp7xwp	2025-07-07 08:01:41.776	2025-07-07 08:01:41.776
cmcstdy9z00trtwsdzd7ekguc	2025-07-07	\N	2025-07-07 08:03:30.885	PULANG	cmc46s9u700d3twlkxxrzmirt	cmck3zuvk0010twsdkc3xecuu	2025-07-07 08:03:30.888	2025-07-07 08:03:30.888
cmcste27500tttwsdz53v4oao	2025-07-07	\N	2025-07-07 08:03:35.967	PULANG	cmc46rwds00bstwlkvna2msl2	cmck0qlgg0008twsdeysp7xwp	2025-07-07 08:03:35.97	2025-07-07 08:03:35.97
cmcste39v00tvtwsd8afk7ze2	2025-07-07	\N	2025-07-07 08:03:37.36	PULANG	cmc46s59s00cqtwlkc8385tg3	cmck3zuvk0010twsdkc3xecuu	2025-07-07 08:03:37.364	2025-07-07 08:03:37.364
cmcstg1lx00txtwsddy2gm919	2025-07-07	\N	2025-07-07 08:05:08.512	PULANG	cmc46trp000ihtwlkk9doz5ah	cmca53cvo00o5twlke9erzxzp	2025-07-07 08:05:08.517	2025-07-07 08:05:08.517
cmcstiqgf00tztwsdrbw5hz4f	2025-07-07	\N	2025-07-07 08:07:14.027	PULANG	cmc46qgrp006ltwlkgmd3zvcp	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 08:07:14.031	2025-07-07 08:07:14.031
cmcstl7r500u3twsdipurmiu9	2025-07-07	\N	2025-07-07 08:09:09.759	PULANG	cmc46rgo400a5twlk8xzlphlx	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 08:09:09.762	2025-07-07 08:09:09.762
cmcstlp3600u5twsd70keht8z	2025-07-07	\N	2025-07-07 08:09:32.223	PULANG	cmc46sc4a00datwlklba5fy78	cmck435iu001stwsdbk5h55wi	2025-07-07 08:09:32.227	2025-07-07 08:09:32.227
cmcstmffv00u7twsd56jas95k	2025-07-07	\N	2025-07-07 08:10:06.374	PULANG	cmc46siu100e0twlksoir3qyk	cmck3zuvk0010twsdkc3xecuu	2025-07-07 08:10:06.38	2025-07-07 08:10:06.38
cmcsts63y00udtwsd7u98slis	2025-07-07	\N	2025-07-07 08:14:34.217	PULANG	cmc46q7m6005qtwlksgmx27n4	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 08:14:34.223	2025-07-07 08:14:34.223
cmcstsevy00uftwsd3738bned	2025-07-07	\N	2025-07-07 08:14:45.596	PULANG	cmc46qs78007qtwlkv76qqm1t	cmc48mqk900nxtwlkpuu6o5zz	2025-07-07 08:14:45.598	2025-07-07 08:14:45.598
cmcsu3y1y00ujtwsdpu813q95	2025-07-07	\N	2025-07-07 08:23:43.65	PULANG	cmc46p7y00012twlkan1t901y	cmc48mero00nvtwlko7dnse2m	2025-07-07 08:23:43.655	2025-07-07 08:23:43.655
cmcsua54d00untwsd1t9ajsn4	2025-07-07	\N	2025-07-07 08:28:32.71	PULANG	cmc46pmrj0035twlkiohdnxpz	cmck41lu4001gtwsdh9n41hyu	2025-07-07 08:28:32.75	2025-07-07 08:28:32.75
cmcsub2w000uptwsdvm3z55r3	2025-07-07	\N	2025-07-07 08:29:16.509	PULANG	cmc46pjq9002ptwlkdlsbonh2	cmck41lu4001gtwsdh9n41hyu	2025-07-07 08:29:16.512	2025-07-07 08:29:16.512
cmcsuv60400uttwsd935r374w	2025-07-07	\N	2025-07-07 08:44:53.662	PULANG	cmc46p6zu000wtwlk8cv819k1	cmck58yj9002itwsdcqhqroi1	2025-07-07 08:44:53.668	2025-07-07 08:44:53.668
cmcsuvxdm00uvtwsd0hwi7ocu	2025-07-07	\N	2025-07-07 08:45:29.144	PULANG	cmc46qpxp007jtwlkmf7x9mjw	cmck42pk6001otwsdlv11onid	2025-07-07 08:45:29.146	2025-07-07 08:45:29.146
cmcsvc99n00v9twsdxom4ejbd	2025-07-07	\N	2025-07-07 08:58:11.047	PULANG	cmc46sgjj00dttwlk2n9q1jja	cmc48n8mc00nztwlkq8l3p7ok	2025-07-07 08:58:11.051	2025-07-07 08:58:11.051
cmctpntzu00wrtwsddclyxzmh	2025-07-07	2025-07-07 23:06:59.605	\N	MASUK	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-07-07 23:06:59.611	2025-07-07 23:06:59.611
cmctptbtt00wttwsdm3frcb4j	2025-07-07	2025-07-07 23:11:15.998	\N	MASUK	cmc46rwds00bstwlkvna2msl2	cmck0qlgg0008twsdeysp7xwp	2025-07-07 23:11:16.001	2025-07-07 23:11:16.001
cmctpxmvn00wvtwsd0tmgkbz3	2025-07-07	2025-07-07 23:14:36.943	\N	MASUK	cmc46p6jo000ttwlkjoqzjw5q	cmck41lu4001gtwsdh9n41hyu	2025-07-07 23:14:36.947	2025-07-07 23:14:36.947
cmctpzwkx00wxtwsd6sv8jixi	2025-07-07	2025-07-07 23:16:22.827	\N	MASUK	cmc46siu100e0twlksoir3qyk	cmck3zuvk0010twsdkc3xecuu	2025-07-07 23:16:22.833	2025-07-07 23:16:22.833
cmctq77z900wztwsd0yial4qx	2025-07-07	2025-07-07 23:22:04.191	\N	MASUK	cmc46s9u700d3twlkxxrzmirt	cmck3zuvk0010twsdkc3xecuu	2025-07-07 23:22:04.198	2025-07-07 23:22:04.198
cmctq7cpm00x1twsd941jja9j	2025-07-07	2025-07-07 23:22:10.328	\N	MASUK	cmc46s59s00cqtwlkc8385tg3	cmck3zuvk0010twsdkc3xecuu	2025-07-07 23:22:10.331	2025-07-07 23:22:10.331
cmctq86jl00x3twsdm6x0y61v	2025-07-07	2025-07-07 23:22:48.991	\N	MASUK	cmc46sneu00eetwlk7gnrmbf8	cmck3zuvk0010twsdkc3xecuu	2025-07-07 23:22:48.994	2025-07-07 23:22:48.994
cmctqgpfu00x7twsdbrd60tyy	2025-07-07	2025-07-07 23:29:26.728	\N	MASUK	cmc46qc9w0067twlkcuynnxtk	cmck0qlgg0008twsdeysp7xwp	2025-07-07 23:29:26.731	2025-07-07 23:29:26.731
cmctqmx8500x9twsdfvwp01y1	2025-07-07	2025-07-07 23:34:16.753	\N	MASUK	cmc46qnhi007atwlkoshg5ob4	cmck0qlgg0008twsdeysp7xwp	2025-07-07 23:34:16.757	2025-07-07 23:34:16.757
cmctqngq500xbtwsd9j7csr1b	2025-07-07	2025-07-07 23:34:42.025	\N	MASUK	cmc46r5k40091twlkc6d32ylm	cmck0qlgg0008twsdeysp7xwp	2025-07-07 23:34:42.029	2025-07-07 23:34:42.029
cmctqpaiv00xdtwsdqowsg175	2025-07-07	2025-07-07 23:36:07.3	\N	MASUK	cmc46seaw00dhtwlknxsz3ms1	cmck40wej001atwsdpzxns3dc	2025-07-07 23:36:07.303	2025-07-07 23:36:07.303
cmctqqs8800xftwsd8inp096p	2025-07-07	2025-07-07 23:37:16.902	\N	MASUK	cmc46poab003dtwlkkkqtlmi4	cmc48mero00nvtwlko7dnse2m	2025-07-07 23:37:16.905	2025-07-07 23:37:16.905
cmctqrmdz00xhtwsd91i0r55z	2025-07-07	2025-07-07 23:37:55.988	\N	MASUK	cmc46pkez002ttwlknaeob0ip	cmck40wej001atwsdpzxns3dc	2025-07-07 23:37:55.992	2025-07-07 23:37:55.992
cmctqrnmc00xjtwsdu9q89lag	2025-07-07	2025-07-07 23:37:57.586	\N	MASUK	cmc46p5ql000ntwlkqrw64rf6	cmc48mero00nvtwlko7dnse2m	2025-07-07 23:37:57.589	2025-07-07 23:37:57.589
cmctqrw5000xltwsd114p9jdv	2025-07-07	2025-07-07 23:38:08.625	\N	MASUK	cmc46phg0002dtwlkt8tcx2ia	cmck40wej001atwsdpzxns3dc	2025-07-07 23:38:08.628	2025-07-07 23:38:08.628
cmctqt3ym00xntwsdpju4id09	2025-07-07	2025-07-07 23:39:05.416	\N	MASUK	cmc46p7y00012twlkan1t901y	cmc48mero00nvtwlko7dnse2m	2025-07-07 23:39:05.423	2025-07-07 23:39:05.423
cmctqtsz900xptwsd3cwmx4ae	2025-07-07	2025-07-07 23:39:37.842	\N	MASUK	cmc46ped8001ytwlkfrb06txj	cmck40wej001atwsdpzxns3dc	2025-07-07 23:39:37.845	2025-07-07 23:39:37.845
cmctqu91z00xrtwsdvpngr5ok	2025-07-07	2025-07-07 23:39:58.677	\N	MASUK	cmc46ra3i009ktwlk4kxhy7zp	cmck418fo001etwsdhf12cdrj	2025-07-07 23:39:58.68	2025-07-07 23:39:58.68
cmctqugjw00xttwsddutap1o6	2025-07-07	2025-07-07 23:40:08.393	\N	MASUK	cmc46qeik006etwlk22jwlw57	cmck42pk6001otwsdlv11onid	2025-07-07 23:40:08.396	2025-07-07 23:40:08.396
cmctqui3b00xvtwsdo76f04lp	2025-07-07	2025-07-07 23:40:10.389	\N	MASUK	cmc46qufe007xtwlk6y6ld8k6	cmck42pk6001otwsdlv11onid	2025-07-07 23:40:10.391	2025-07-07 23:40:10.391
cmctqvaxh00xxtwsdwfk3cm11	2025-07-07	2025-07-07 23:40:47.762	\N	MASUK	cmc46s31000cdtwlkt2zewnu5	cmck413cb001ctwsddb4r6abm	2025-07-07 23:40:47.765	2025-07-07 23:40:47.765
cmctr08u400xztwsdks12fa12	2025-07-07	2025-07-07 23:44:38.329	\N	MASUK	cmc46swpg00fetwlkx51xpyx3	cmck406q40014twsd4gqd9j1a	2025-07-07 23:44:38.332	2025-07-07 23:44:38.332
cmctr0aba00y1twsdlq1jhwsf	2025-07-07	2025-07-07 23:44:40.243	\N	MASUK	cmc46sufy00f1twlkyabfajk9	cmck406q40014twsd4gqd9j1a	2025-07-07 23:44:40.246	2025-07-07 23:44:40.246
cmctr1pmp00y3twsdkda7cnuh	2025-07-07	2025-07-07 23:45:46.75	\N	MASUK	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-07-07 23:45:46.753	2025-07-07 23:45:46.753
cmctr1uxu00y5twsdlygo9l09	2025-07-07	2025-07-07 23:45:53.632	\N	MASUK	cmc46pmrj0035twlkiohdnxpz	cmck41lu4001gtwsdh9n41hyu	2025-07-07 23:45:53.634	2025-07-07 23:45:53.634
cmctr7iq600y7twsdyvoyjwud	2025-07-07	2025-07-07 23:50:17.736	\N	MASUK	cmc46pwha004itwlkuzsyazgn	cmc48mero00nvtwlko7dnse2m	2025-07-07 23:50:17.742	2025-07-07 23:50:17.742
cmctrn3x100y9twsd1kdcdrgn	2025-07-08	2025-07-08 00:02:25.039	\N	MASUK	cmc46rixs00aitwlkpg86h565	cmck40wej001atwsdpzxns3dc	2025-07-08 00:02:25.045	2025-07-08 00:02:25.045
cmctrnyze00ybtwsd2z20kzrc	2025-07-08	2025-07-08 00:03:05.303	\N	MASUK	cmc46ru3200bhtwlkqx7b7u7h	cmck40wej001atwsdpzxns3dc	2025-07-08 00:03:05.307	2025-07-08 00:03:05.307
cmctrokz700ydtwsd6gcsggyw	2025-07-08	2025-07-08 00:03:33.809	\N	MASUK	cmc46tkyl00hrtwlkewcqik62	cmck0tens000atwsdmwj9xk2w	2025-07-08 00:03:33.812	2025-07-08 00:03:33.812
cmctrpqck00yftwsdali7vbeg	2025-07-08	2025-07-08 00:04:27.426	\N	MASUK	cmc46rpmn00b3twlk3kcu7mik	cmck40wej001atwsdpzxns3dc	2025-07-08 00:04:27.428	2025-07-08 00:04:27.428
cmctrpx4m00yhtwsderx8jvqd	2025-07-08	2025-07-08 00:04:36.21	\N	MASUK	cmc46ryle00bztwlkx7awij04	cmck3zuvk0010twsdkc3xecuu	2025-07-08 00:04:36.214	2025-07-08 00:04:36.214
cmctrrm3i00yjtwsdm20m1b1x	2025-07-08	2025-07-08 00:05:55.228	\N	MASUK	cmc46pjq9002ptwlkdlsbonh2	cmck41lu4001gtwsdh9n41hyu	2025-07-08 00:05:55.231	2025-07-08 00:05:55.231
cmctrsdvj00yltwsdjwh3vj00	2025-07-08	2025-07-08 00:06:31.228	\N	MASUK	cmc46ubh400ketwlkkfu8nopc	cmck401eu0012twsds1qwqjw4	2025-07-08 00:06:31.231	2025-07-08 00:06:31.231
cmctsqex100yntwsdbuos3d4a	2025-07-08	2025-07-08 00:32:58.879	\N	MASUK	cmc46uopi00lutwlk6ky20hrv	cmck406q40014twsd4gqd9j1a	2025-07-08 00:32:58.885	2025-07-08 00:32:58.885
cmctsqz9d00yptwsdh1tk15y0	2025-07-08	2025-07-08 00:33:25.246	\N	MASUK	cmc46v45w00ndtwlk563qy6nd	cmck406q40014twsd4gqd9j1a	2025-07-08 00:33:25.249	2025-07-08 00:33:25.249
cmcttgbk800yttwsdwhxpyikd	2025-07-08	2025-07-08 00:53:07.586	\N	MASUK	cmc46pizj002mtwlk8pxdg8ys	cmck45ltr0026twsdhzuwstv3	2025-07-08 00:53:07.592	2025-07-08 00:53:07.592
cmcttivpy00yvtwsd9cj9hen9	2025-07-08	2025-07-08 00:55:07.027	\N	MASUK	cmc46qj48006wtwlkxjg53s62	cmck40i2v0018twsdmoshgxtd	2025-07-08 00:55:07.03	2025-07-08 00:55:07.03
cmcttjh5600yxtwsdmgclryb8	2025-07-08	2025-07-08 00:55:34.791	\N	MASUK	cmc46r7ti009dtwlkxkev0j8x	cmck40i2v0018twsdmoshgxtd	2025-07-08 00:55:34.794	2025-07-08 00:55:34.794
cmcttjur900yztwsd3vd3xss8	2025-07-08	2025-07-08 00:55:52.433	\N	MASUK	cmc46r3af008utwlkutramzmy	cmck40i2v0018twsdmoshgxtd	2025-07-08 00:55:52.437	2025-07-08 00:55:52.437
cmcttlx2m00z1twsdg4cdapwr	2025-07-08	2025-07-08 00:57:28.737	\N	MASUK	cmc46p8e60015twlkpm6xqld4	cmck45ltr0026twsdhzuwstv3	2025-07-08 00:57:28.751	2025-07-08 00:57:28.751
cmctujj5m00zdtwsd396swms1	2025-07-08	2025-07-08 01:23:37.012	\N	MASUK	cmc46pt0l0041twlk75hwckll	cmck4dzm8002gtwsdwfchlzo8	2025-07-08 01:23:37.018	2025-07-08 01:23:37.018
cmctujyjl00zftwsddmhyico8	2025-07-08	2025-07-08 01:23:56.956	\N	MASUK	cmc46q2rq005atwlks6oghu8m	cmck4dzm8002gtwsdwfchlzo8	2025-07-08 01:23:56.962	2025-07-08 01:23:56.962
cmctujymb00zhtwsdvx4aljn9	2025-07-08	2025-07-08 01:23:57.056	\N	MASUK	cmc46q15w0052twlkhtfrzd6q	cmck4dzm8002gtwsdwfchlzo8	2025-07-08 01:23:57.059	2025-07-08 01:23:57.059
cmctukdfr00zjtwsdhjzt7gmi	2025-07-08	2025-07-08 01:24:16.259	\N	MASUK	cmc46q3kk005dtwlk36s2a65a	cmck4dzm8002gtwsdwfchlzo8	2025-07-08 01:24:16.263	2025-07-08 01:24:16.263
cmcu2bk1z010htwsdgv5f5ey1	2025-07-08	\N	2025-07-08 05:01:21.841	PULANG	cmc46pq1s003ltwlkhuevqi62	cmck44fxi0022twsdqewf2qfz	2025-07-08 05:01:21.863	2025-07-08 05:01:21.863
cmcu758ot010ttwsdtygjwx1v	2025-07-08	\N	2025-07-08 07:16:25.27	PULANG	cmc46q15w0052twlkhtfrzd6q	cmck4dzm8002gtwsdwfchlzo8	2025-07-08 07:16:25.278	2025-07-08 07:16:25.278
cmcu8edos0113twsd29kh8xy0	2025-07-08	\N	2025-07-08 07:51:31.273	PULANG	cmc46pizj002mtwlk8pxdg8ys	cmck45ltr0026twsdhzuwstv3	2025-07-08 07:51:31.276	2025-07-08 07:51:31.276
cmcu8f1ex0115twsdopwpaqrb	2025-07-08	\N	2025-07-08 07:52:02.022	PULANG	cmc46p8e60015twlkpm6xqld4	cmck45ltr0026twsdhzuwstv3	2025-07-08 07:52:02.025	2025-07-08 07:52:02.025
cmcu8nu8d011dtwsd8991z1x1	2025-07-08	\N	2025-07-08 07:58:52.619	PULANG	cmc46qc9w0067twlkcuynnxtk	cmck0qlgg0008twsdeysp7xwp	2025-07-08 07:58:52.622	2025-07-08 07:58:52.622
cmcu8pkl9011jtwsdz0dg9dxf	2025-07-08	\N	2025-07-08 08:00:13.434	PULANG	cmc46seaw00dhtwlknxsz3ms1	cmck40wej001atwsdpzxns3dc	2025-07-08 08:00:13.437	2025-07-08 08:00:13.437
cmcu8raiz011ptwsdpcz8daeh	2025-07-08	\N	2025-07-08 08:01:33.704	PULANG	cmc46ru3200bhtwlkqx7b7u7h	cmck40wej001atwsdpzxns3dc	2025-07-08 08:01:33.707	2025-07-08 08:01:33.707
cmcu8s1de011rtwsd59wunrpm	2025-07-08	\N	2025-07-08 08:02:08.496	PULANG	cmc46tkyl00hrtwlkewcqik62	cmck0tens000atwsdmwj9xk2w	2025-07-08 08:02:08.499	2025-07-08 08:02:08.499
cmcu8tfcy011vtwsd7vy70ax7	2025-07-08	\N	2025-07-08 08:03:13.278	PULANG	cmc46pwha004itwlkuzsyazgn	cmc48mero00nvtwlko7dnse2m	2025-07-08 08:03:13.282	2025-07-08 08:03:13.282
cmcu8xmd80127twsdodig3bty	2025-07-08	\N	2025-07-08 08:06:28.985	PULANG	cmc46r7ti009dtwlkxkev0j8x	cmck40i2v0018twsdmoshgxtd	2025-07-08 08:06:28.989	2025-07-08 08:06:28.989
cmcu8yyo2012dtwsd0x3rkxlj	2025-07-08	\N	2025-07-08 08:07:31.583	PULANG	cmc46qj48006wtwlkxjg53s62	cmck40i2v0018twsdmoshgxtd	2025-07-08 08:07:31.586	2025-07-08 08:07:31.586
cmcu8zc4p012ftwsd3blslejs	2025-07-08	\N	2025-07-08 08:07:49.03	PULANG	cmc46r3af008utwlkutramzmy	cmck40i2v0018twsdmoshgxtd	2025-07-08 08:07:49.033	2025-07-08 08:07:49.033
cmcu9ah9u012htwsd5yu1zhet	2025-07-08	\N	2025-07-08 08:16:28.907	PULANG	cmc46pt0l0041twlk75hwckll	cmck4dzm8002gtwsdwfchlzo8	2025-07-08 08:16:28.914	2025-07-08 08:16:28.914
cmcuamjz5012xtwsdnu1edzz6	2025-07-08	\N	2025-07-08 08:53:51.898	PULANG	cmc46uopi00lutwlk6ky20hrv	cmck406q40014twsd4gqd9j1a	2025-07-08 08:53:51.905	2025-07-08 08:53:51.905
cmcuao1lx012ztwsd63vw83fb	2025-07-08	\N	2025-07-08 08:55:01.411	PULANG	cmc46v45w00ndtwlk563qy6nd	cmck406q40014twsd4gqd9j1a	2025-07-08 08:55:01.414	2025-07-08 08:55:01.414
cmcuaod4s0131twsdfhhhwjpd	2025-07-08	\N	2025-07-08 08:55:16.345	PULANG	cmc46sufy00f1twlkyabfajk9	cmck406q40014twsd4gqd9j1a	2025-07-08 08:55:16.349	2025-07-08 08:55:16.349
cmcuaogra0133twsd2jc6q7a9	2025-07-08	\N	2025-07-08 08:55:21.043	PULANG	cmc46swpg00fetwlkx51xpyx3	cmck406q40014twsd4gqd9j1a	2025-07-08 08:55:21.047	2025-07-08 08:55:21.047
cmcuart4w0139twsdgx6jbv4v	2025-07-08	\N	2025-07-08 08:57:57.053	PULANG	cmc46q2rq005atwlks6oghu8m	cmck4dzm8002gtwsdwfchlzo8	2025-07-08 08:57:57.056	2025-07-08 08:57:57.056
cmcv52rme014dtwsdkjvo21bi	2025-07-08	2025-07-08 23:06:16.769	\N	MASUK	cmc46p6jo000ttwlkjoqzjw5q	cmck41lu4001gtwsdh9n41hyu	2025-07-08 23:06:16.79	2025-07-08 23:06:16.79
cmcv5cxr5014ftwsdhpw5zj11	2025-07-08	2025-07-08 23:14:11.293	\N	MASUK	cmc46pmrj0035twlkiohdnxpz	cmck41lu4001gtwsdh9n41hyu	2025-07-08 23:14:11.297	2025-07-08 23:14:11.297
cmcv5khim014htwsdv167ps2l	2025-07-08	2025-07-08 23:20:03.497	\N	MASUK	cmc46rwds00bstwlkvna2msl2	cmck0qlgg0008twsdeysp7xwp	2025-07-08 23:20:03.503	2025-07-08 23:20:03.503
cmcv5kuas014jtwsd1mqlwlh8	2025-07-08	2025-07-08 23:20:20.065	\N	MASUK	cmc46siu100e0twlksoir3qyk	cmck3zuvk0010twsdkc3xecuu	2025-07-08 23:20:20.068	2025-07-08 23:20:20.068
cmcv5oypy014ntwsdz7y8qklr	2025-07-08	2025-07-08 23:23:32.42	\N	MASUK	cmc46sneu00eetwlk7gnrmbf8	cmck3zuvk0010twsdkc3xecuu	2025-07-08 23:23:32.423	2025-07-08 23:23:32.423
cmcv5q8ke014ptwsdp7lw98zk	2025-07-08	2025-07-08 23:24:31.834	\N	MASUK	cmc46r5k40091twlkc6d32ylm	cmck0qlgg0008twsdeysp7xwp	2025-07-08 23:24:31.838	2025-07-08 23:24:31.838
cmcv5s7gi014rtwsdfyj9q7pp	2025-07-08	2025-07-08 23:26:03.71	\N	MASUK	cmc46qnhi007atwlkoshg5ob4	cmck0qlgg0008twsdeysp7xwp	2025-07-08 23:26:03.714	2025-07-08 23:26:03.714
cmcv5sjg8014ttwsdqksqp8qh	2025-07-08	2025-07-08 23:26:19.247	\N	MASUK	cmc46qlb20073twlkwsk9yxzh	cmc48mqk900nxtwlkpuu6o5zz	2025-07-08 23:26:19.257	2025-07-08 23:26:19.257
cmcv5xncs014vtwsdv8vvbdlq	2025-07-08	2025-07-08 23:30:17.594	\N	MASUK	cmc46s9u700d3twlkxxrzmirt	cmck3zuvk0010twsdkc3xecuu	2025-07-08 23:30:17.597	2025-07-08 23:30:17.597
cmcv5xqfp014xtwsd6a2jau6o	2025-07-08	2025-07-08 23:30:21.586	\N	MASUK	cmc46s59s00cqtwlkc8385tg3	cmck3zuvk0010twsdkc3xecuu	2025-07-08 23:30:21.589	2025-07-08 23:30:21.589
cmcv5zw9t014ztwsdag1s53js	2025-07-08	2025-07-08 23:32:02.46	\N	MASUK	cmc46qc9w0067twlkcuynnxtk	cmck0qlgg0008twsdeysp7xwp	2025-07-08 23:32:02.466	2025-07-08 23:32:02.466
cmcv643r50151twsdk7ixatpl	2025-07-08	2025-07-08 23:35:18.783	\N	MASUK	cmc46pkez002ttwlknaeob0ip	cmck40wej001atwsdpzxns3dc	2025-07-08 23:35:18.786	2025-07-08 23:35:18.786
cmcv64rgi0153twsdcpvkfdez	2025-07-08	2025-07-08 23:35:49.503	\N	MASUK	cmc46ped8001ytwlkfrb06txj	cmck40wej001atwsdpzxns3dc	2025-07-08 23:35:49.506	2025-07-08 23:35:49.506
cmcv68osc0157twsdj3564ip8	2025-07-08	2025-07-08 23:38:52.652	\N	MASUK	cmc46pnhf003atwlk0zw4shj9	cmck439di001utwsdypps76dc	2025-07-08 23:38:52.669	2025-07-08 23:38:52.669
cmcv6a1wb0159twsdvfwgem46	2025-07-08	2025-07-08 23:39:56.312	\N	MASUK	cmc46qgrp006ltwlkgmd3zvcp	cmc48mqk900nxtwlkpuu6o5zz	2025-07-08 23:39:56.315	2025-07-08 23:39:56.315
cmcv6b45m015btwsd5fiypzva	2025-07-08	2025-07-08 23:40:45.895	\N	MASUK	cmc46ra3i009ktwlk4kxhy7zp	cmck418fo001etwsdhf12cdrj	2025-07-08 23:40:45.898	2025-07-08 23:40:45.898
cmcv6b4ta015dtwsdcpmgd6rb	2025-07-08	2025-07-08 23:40:46.747	\N	MASUK	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-07-08 23:40:46.75	2025-07-08 23:40:46.75
cmcv6ba6r015ftwsdczhpau53	2025-07-08	2025-07-08 23:40:53.699	\N	MASUK	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-07-08 23:40:53.715	2025-07-08 23:40:53.715
cmcv6bi2g015htwsdov6r0qo2	2025-07-08	2025-07-08 23:41:03.926	\N	MASUK	cmc46qyuo008gtwlkpfrhsk5a	cmc48mqk900nxtwlkpuu6o5zz	2025-07-08 23:41:03.929	2025-07-08 23:41:03.929
cmcv6cg47015jtwsd17bam79o	2025-07-08	2025-07-08 23:41:48.052	\N	MASUK	cmc46s31000cdtwlkt2zewnu5	cmck413cb001ctwsddb4r6abm	2025-07-08 23:41:48.056	2025-07-08 23:41:48.056
cmcv6cit2015ntwsdzz18wah8	2025-07-08	2025-07-08 23:41:51.538	\N	MASUK	cmc46pghq0029twlka9885aqa	cmck468tu002ctwsd61d0pz44	2025-07-08 23:41:51.543	2025-07-08 23:41:51.543
cmcv6cwu5015ptwsdpcmuzufe	2025-07-08	2025-07-08 23:42:09.723	\N	MASUK	cmc46pc16001ltwlkd7477efh	cmck468tu002ctwsd61d0pz44	2025-07-08 23:42:09.726	2025-07-08 23:42:09.726
cmcv6dy3b015rtwsd550eiucp	2025-07-08	2025-07-08 23:42:58.004	\N	MASUK	cmc46pl8k002xtwlkrv1parfp	cmck468tu002ctwsd61d0pz44	2025-07-08 23:42:58.007	2025-07-08 23:42:58.007
cmcv6e3uw015ttwsdifdaodo8	2025-07-08	2025-07-08 23:43:05.477	\N	MASUK	cmc46seaw00dhtwlknxsz3ms1	cmck40wej001atwsdpzxns3dc	2025-07-08 23:43:05.48	2025-07-08 23:43:05.48
cmcv6h65e015vtwsdjd5k9nz7	2025-07-08	2025-07-08 23:45:28.415	\N	MASUK	cmc46rndz00awtwlkmxzfjiix	cmc48mqk900nxtwlkpuu6o5zz	2025-07-08 23:45:28.418	2025-07-08 23:45:28.418
cmcv6hz6e015ztwsd0w5ofdys	2025-07-08	2025-07-08 23:46:06.035	\N	MASUK	cmc46qufe007xtwlk6y6ld8k6	cmck42pk6001otwsdlv11onid	2025-07-08 23:46:06.038	2025-07-08 23:46:06.038
cmcv6ij5p0161twsd30x43x3g	2025-07-08	2025-07-08 23:46:31.93	\N	MASUK	cmc46phg0002dtwlkt8tcx2ia	cmck40wej001atwsdpzxns3dc	2025-07-08 23:46:31.933	2025-07-08 23:46:31.933
cmcv6ojss0163twsdzm5icc7j	2025-07-08	2025-07-08 23:51:12.695	\N	MASUK	cmc46p5ql000ntwlkqrw64rf6	cmc48mero00nvtwlko7dnse2m	2025-07-08 23:51:12.7	2025-07-08 23:51:12.7
cmcv6oz220165twsdfodvl0gm	2025-07-08	2025-07-08 23:51:32.471	\N	MASUK	cmc46poab003dtwlkkkqtlmi4	cmc48mero00nvtwlko7dnse2m	2025-07-08 23:51:32.474	2025-07-08 23:51:32.474
cmcv6v9m80167twsd92tffncq	2025-07-08	2025-07-08 23:56:26.091	\N	MASUK	cmc46pwha004itwlkuzsyazgn	cmc48mero00nvtwlko7dnse2m	2025-07-08 23:56:26.096	2025-07-08 23:56:26.096
cmcv6vtyw0169twsd4omo4dg6	2025-07-08	2025-07-08 23:56:52.469	\N	MASUK	cmc46p7y00012twlkan1t901y	cmc48mero00nvtwlko7dnse2m	2025-07-08 23:56:52.472	2025-07-08 23:56:52.472
cmcv6wu9s016btwsdgyhe3kkp	2025-07-08	2025-07-08 23:57:39.517	\N	MASUK	cmc46p64g000qtwlkv3exmjxb	cmck461f1002atwsd7hvt6jif	2025-07-08 23:57:39.52	2025-07-08 23:57:39.52
cmcv6xp9c016dtwsd14yrmgdr	2025-07-08	2025-07-08 23:58:19.678	\N	MASUK	cmc46pa83001dtwlkw34o2zus	cmck461f1002atwsd7hvt6jif	2025-07-08 23:58:19.681	2025-07-08 23:58:19.681
cmcv6zllf016ftwsdlnueipjn	2025-07-08	2025-07-08 23:59:48.241	\N	MASUK	cmc46tn5q00hytwlknc1ofewc	cmck3xw5t000qtwsdwrv2o0ua	2025-07-08 23:59:48.244	2025-07-08 23:59:48.244
cmcv70c89016jtwsduw0kla5e	2025-07-09	2025-07-09 00:00:22.758	\N	MASUK	cmc46sufy00f1twlkyabfajk9	cmck406q40014twsd4gqd9j1a	2025-07-09 00:00:22.761	2025-07-09 00:00:22.761
cmcv710z8016ltwsdrrpfag7w	2025-07-09	2025-07-09 00:00:54.834	\N	MASUK	cmc46qs78007qtwlkv76qqm1t	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 00:00:54.836	2025-07-09 00:00:54.836
cmcv71k2h016ntwsd6pawppyg	2025-07-09	2025-07-09 00:01:19.573	\N	MASUK	cmc46udog00kltwlk8mp3jpsw	cmck3xw5t000qtwsdwrv2o0ua	2025-07-09 00:01:19.577	2025-07-09 00:01:19.577
cmcv72ntb016ptwsdpjio8ym2	2025-07-09	2025-07-09 00:02:11.084	\N	MASUK	cmc46swpg00fetwlkx51xpyx3	cmck406q40014twsd4gqd9j1a	2025-07-09 00:02:11.087	2025-07-09 00:02:11.087
cmcv73sce016rtwsddp5t67ot	2025-07-09	2025-07-09 00:03:03.612	\N	MASUK	cmc46v8mu00nrtwlkm3c62zp1	cmck3xw5t000qtwsdwrv2o0ua	2025-07-09 00:03:03.615	2025-07-09 00:03:03.615
cmcv7440f016ttwsd14dgvvvc	2025-07-09	2025-07-09 00:03:18.732	\N	MASUK	cmc46t12y00fptwlkqbiheqi2	cmck3xw5t000qtwsdwrv2o0ua	2025-07-09 00:03:18.735	2025-07-09 00:03:18.735
cmcv76omb016vtwsdt67sjdz4	2025-07-09	2025-07-09 00:05:18.752	\N	MASUK	cmc46q7m6005qtwlksgmx27n4	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 00:05:18.755	2025-07-09 00:05:18.755
cmcv7b95y016xtwsdubis53ge	2025-07-09	2025-07-09 00:08:52.001	\N	MASUK	cmc46q5ev005jtwlkm0nl2m8g	cmck418fo001etwsdhf12cdrj	2025-07-09 00:08:52.006	2025-07-09 00:08:52.006
cmcv7f7aa016ztwsd5i1dz2i6	2025-07-09	2025-07-09 00:11:56.187	\N	MASUK	cmc46uzp400mttwlk0oazh0s3	cmck401eu0012twsds1qwqjw4	2025-07-09 00:11:56.195	2025-07-09 00:11:56.195
cmcv7gjpq0171twsdzcigepot	2025-07-09	2025-07-09 00:12:58.955	\N	MASUK	cmc46sl0j00e7twlkracec5rj	cmck0qlgg0008twsdeysp7xwp	2025-07-09 00:12:58.958	2025-07-09 00:12:58.958
cmcv7x0r60179twsdf0x77574	2025-07-09	2025-07-09 00:25:47.534	\N	MASUK	cmc46uva300mftwlk0yfyi1q9	cmck3y53f000stwsdvoovf2pk	2025-07-09 00:25:47.538	2025-07-09 00:25:47.538
cmcv830yc017ltwsd6awmy2j5	2025-07-09	2025-07-09 00:30:27.729	\N	MASUK	cmc46trp000ihtwlkk9doz5ah	cmca53cvo00o5twlke9erzxzp	2025-07-09 00:30:27.733	2025-07-09 00:30:27.733
cmcv840vy017rtwsdso52ujfl	2025-07-09	2025-07-09 00:31:14.299	\N	MASUK	cmc46rgo400a5twlk8xzlphlx	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 00:31:14.303	2025-07-09 00:31:14.303
cmcv8583q017ttwsdfli9yp41	2025-07-09	2025-07-09 00:32:10.302	\N	MASUK	cmc46p6zu000wtwlk8cv819k1	cmck58yj9002itwsdcqhqroi1	2025-07-09 00:32:10.31	2025-07-09 00:32:10.31
cmcv95eu2017vtwsdvspojd02	2025-07-09	2025-07-09 01:00:18.646	\N	MASUK	cmc46sc4a00datwlklba5fy78	cmck435iu001stwsdbk5h55wi	2025-07-09 01:00:18.65	2025-07-09 01:00:18.65
cmcv9a71z017ztwsd43jmkbmk	2025-07-09	2025-07-09 01:04:01.841	\N	MASUK	cmc46t5kl00g8twlkurga8kks	cmck0vrtn000gtwsdjzf0zz94	2025-07-09 01:04:01.847	2025-07-09 01:04:01.847
cmcv9mvyg0183twsd3qvgdlf4	2025-07-09	2025-07-09 01:13:53.985	\N	MASUK	cmc46pq1s003ltwlkhuevqi62	cmck44fxi0022twsdqewf2qfz	2025-07-09 01:13:53.992	2025-07-09 01:13:53.992
cmcvai4a2018btwsdcfg7v9zu	2025-07-09	2025-07-09 01:38:11.108	\N	MASUK	cmc46qwna0089twlkok4h7czv	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 01:38:11.114	2025-07-09 01:38:11.114
cmcvb1owh018ftwsd7523jajd	2025-07-09	2025-07-09 01:53:24.301	\N	MASUK	cmc46qeik006etwlk22jwlw57	cmck42pk6001otwsdlv11onid	2025-07-09 01:53:24.305	2025-07-09 01:53:24.305
cmcvlzas80193twsd2ngzqg0z	2025-07-09	\N	2025-07-09 06:59:28.464	PULANG	cmc46pnhf003atwlk0zw4shj9	cmck439di001utwsdypps76dc	2025-07-09 06:59:28.472	2025-07-09 06:59:28.472
cmcvml55s0197twsd6w9xxubc	2025-07-09	\N	2025-07-09 07:16:27.61	PULANG	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-07-09 07:16:27.616	2025-07-09 07:16:27.616
cmcvn344u019dtwsdnyd75xt8	2025-07-09	\N	2025-07-09 07:30:26.089	PULANG	cmc46uva300mftwlk0yfyi1q9	cmck3y53f000stwsdvoovf2pk	2025-07-09 07:30:26.095	2025-07-09 07:30:26.095
cmcvndwz8019ntwsdy26dey1y	2025-07-09	\N	2025-07-09 07:38:50.026	PULANG	cmc46ttvb00iotwlkamx55iuo	cmck0vrtn000gtwsdjzf0zz94	2025-07-09 07:38:50.037	2025-07-09 07:38:50.037
cmcvnelo3019ptwsd1blhoabm	2025-07-09	\N	2025-07-09 07:39:22.032	PULANG	cmc46t5kl00g8twlkurga8kks	cmck0vrtn000gtwsdjzf0zz94	2025-07-09 07:39:22.035	2025-07-09 07:39:22.035
cmcvnjcah019xtwsdj3ylvs21	2025-07-09	\N	2025-07-09 07:43:03.157	PULANG	cmc46ra3i009ktwlk4kxhy7zp	cmck418fo001etwsdhf12cdrj	2025-07-09 07:43:03.161	2025-07-09 07:43:03.161
cmcvnmtg1019ztwsdateom3aw	2025-07-09	\N	2025-07-09 07:45:45.355	PULANG	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-07-09 07:45:45.361	2025-07-09 07:45:45.361
cmcvntxj601a3twsd3ic4r3x8	2025-07-09	\N	2025-07-09 07:51:17.245	PULANG	cmc46pkez002ttwlknaeob0ip	cmck40wej001atwsdpzxns3dc	2025-07-09 07:51:17.25	2025-07-09 07:51:17.25
cmcvnvyiq01a5twsdhsyieyzu	2025-07-09	\N	2025-07-09 07:52:51.838	PULANG	cmc46ped8001ytwlkfrb06txj	cmck40wej001atwsdpzxns3dc	2025-07-09 07:52:51.843	2025-07-09 07:52:51.843
cmcvnwbr701a7twsdnajsimyk	2025-07-09	\N	2025-07-09 07:53:08.993	PULANG	cmc46phg0002dtwlkt8tcx2ia	cmck40wej001atwsdpzxns3dc	2025-07-09 07:53:08.995	2025-07-09 07:53:08.995
cmcvnx72s01a9twsdnmno039h	2025-07-09	\N	2025-07-09 07:53:49.585	PULANG	cmc46rpmn00b3twlk3kcu7mik	cmck40wej001atwsdpzxns3dc	2025-07-09 07:53:49.589	2025-07-09 07:53:49.589
cmcvnxjn901abtwsd0qey8vr4	2025-07-09	\N	2025-07-09 07:54:05.872	PULANG	cmc46p6jo000ttwlkjoqzjw5q	cmck41lu4001gtwsdh9n41hyu	2025-07-09 07:54:05.877	2025-07-09 07:54:05.877
cmcvny6qu01adtwsd103pevbn	2025-07-09	\N	2025-07-09 07:54:35.811	PULANG	cmc46rixs00aitwlkpg86h565	cmck40wej001atwsdpzxns3dc	2025-07-09 07:54:35.814	2025-07-09 07:54:35.814
cmcvo02eb01aftwsdvzg787kl	2025-07-09	\N	2025-07-09 07:56:03.488	PULANG	cmc46qgrp006ltwlkgmd3zvcp	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 07:56:03.492	2025-07-09 07:56:03.492
cmcvo0kf801ahtwsdqx65jd3s	2025-07-09	\N	2025-07-09 07:56:26.848	PULANG	cmc46r5k40091twlkc6d32ylm	cmck0qlgg0008twsdeysp7xwp	2025-07-09 07:56:26.853	2025-07-09 07:56:26.853
cmcvo0o7501ajtwsdo853jr6e	2025-07-09	\N	2025-07-09 07:56:31.734	PULANG	cmc46q7m6005qtwlksgmx27n4	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 07:56:31.745	2025-07-09 07:56:31.745
cmcvo0v1901altwsd227noq9c	2025-07-09	\N	2025-07-09 07:56:40.602	PULANG	cmc46qnhi007atwlkoshg5ob4	cmck0qlgg0008twsdeysp7xwp	2025-07-09 07:56:40.605	2025-07-09 07:56:40.605
cmcvo1lbt01antwsdx019xk8a	2025-07-09	\N	2025-07-09 07:57:14.678	PULANG	cmc46ryle00bztwlkx7awij04	cmck3zuvk0010twsdkc3xecuu	2025-07-09 07:57:14.682	2025-07-09 07:57:14.682
cmcvo2qp001artwsdoxb2i3mm	2025-07-09	\N	2025-07-09 07:58:08.288	PULANG	cmc46qs78007qtwlkv76qqm1t	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 07:58:08.292	2025-07-09 07:58:08.292
cmcvo33ag01avtwsdtfnuwiu7	2025-07-09	\N	2025-07-09 07:58:24.614	PULANG	cmc46qeik006etwlk22jwlw57	cmck42pk6001otwsdlv11onid	2025-07-09 07:58:24.617	2025-07-09 07:58:24.617
cmcvo5xs401b3twsd5up6hijg	2025-07-09	\N	2025-07-09 08:00:37.44	PULANG	cmc46sc4a00datwlklba5fy78	cmck435iu001stwsdbk5h55wi	2025-07-09 08:00:37.445	2025-07-09 08:00:37.445
cmcvo692101b5twsdgsvs23ns	2025-07-09	\N	2025-07-09 08:00:52.055	PULANG	cmc46s31000cdtwlkt2zewnu5	cmck413cb001ctwsddb4r6abm	2025-07-09 08:00:52.058	2025-07-09 08:00:52.058
cmcvo6lvp01b7twsdz57hn23r	2025-07-09	\N	2025-07-09 08:01:08.675	PULANG	cmc46rwds00bstwlkvna2msl2	cmck0qlgg0008twsdeysp7xwp	2025-07-09 08:01:08.678	2025-07-09 08:01:08.678
cmcvo6uvo01b9twsdic1u1xva	2025-07-09	\N	2025-07-09 08:01:20.337	PULANG	cmc46pjq9002ptwlkdlsbonh2	cmck41lu4001gtwsdh9n41hyu	2025-07-09 08:01:20.34	2025-07-09 08:01:20.34
cmcvo7kve01bdtwsdlqdbwlhr	2025-07-09	\N	2025-07-09 08:01:54.022	PULANG	cmc46pmrj0035twlkiohdnxpz	cmck41lu4001gtwsdh9n41hyu	2025-07-09 08:01:54.026	2025-07-09 08:01:54.026
cmcvo80my01bftwsdf9dgna1e	2025-07-09	\N	2025-07-09 08:02:14.454	PULANG	cmc46pl8k002xtwlkrv1parfp	cmck468tu002ctwsd61d0pz44	2025-07-09 08:02:14.458	2025-07-09 08:02:14.458
cmcvo84ug01bhtwsdh45ev9e7	2025-07-09	\N	2025-07-09 08:02:19.909	PULANG	cmc46p5ql000ntwlkqrw64rf6	cmc48mero00nvtwlko7dnse2m	2025-07-09 08:02:19.912	2025-07-09 08:02:19.912
cmcvo8ix901bjtwsdce8tq8yx	2025-07-09	\N	2025-07-09 08:02:38.152	PULANG	cmc46pghq0029twlka9885aqa	cmck468tu002ctwsd61d0pz44	2025-07-09 08:02:38.157	2025-07-09 08:02:38.157
cmcvo95nu01bltwsdyzisp2ns	2025-07-09	\N	2025-07-09 08:03:07.623	PULANG	cmc46siu100e0twlksoir3qyk	cmck3zuvk0010twsdkc3xecuu	2025-07-09 08:03:07.626	2025-07-09 08:03:07.626
cmcvo975c01bntwsdeff0qokr	2025-07-09	\N	2025-07-09 08:03:09.55	PULANG	cmc46pc16001ltwlkd7477efh	cmck468tu002ctwsd61d0pz44	2025-07-09 08:03:09.553	2025-07-09 08:03:09.553
cmcvo9bt601bptwsdj2wqknta	2025-07-09	\N	2025-07-09 08:03:15.589	PULANG	cmc46sl0j00e7twlkracec5rj	cmck0qlgg0008twsdeysp7xwp	2025-07-09 08:03:15.595	2025-07-09 08:03:15.595
cmcvob99v01brtwsda7n0lbrp	2025-07-09	\N	2025-07-09 08:04:45.616	PULANG	cmc46p7y00012twlkan1t901y	cmc48mero00nvtwlko7dnse2m	2025-07-09 08:04:45.619	2025-07-09 08:04:45.619
cmcvoeigd01bxtwsda79a5f17	2025-07-09	\N	2025-07-09 08:07:17.479	PULANG	cmc46s9u700d3twlkxxrzmirt	cmck3zuvk0010twsdkc3xecuu	2025-07-09 08:07:17.485	2025-07-09 08:07:17.485
cmcvoej1r01bztwsd4utvu7va	2025-07-09	\N	2025-07-09 08:07:18.252	PULANG	cmc46s59s00cqtwlkc8385tg3	cmck3zuvk0010twsdkc3xecuu	2025-07-09 08:07:18.255	2025-07-09 08:07:18.255
cmcvohr2y01c1twsdr3jfdtef	2025-07-09	\N	2025-07-09 08:09:48.631	PULANG	cmc46rgo400a5twlk8xzlphlx	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 08:09:48.634	2025-07-09 08:09:48.634
cmcvoloqn01c5twsdg4d2tmkk	2025-07-09	\N	2025-07-09 08:12:52.215	PULANG	cmc46sgjj00dttwlk2n9q1jja	cmc48n8mc00nztwlkq8l3p7ok	2025-07-09 08:12:52.224	2025-07-09 08:12:52.224
cmcvos83a01c9twsdyowu48cl	2025-07-09	\N	2025-07-09 08:17:57.234	PULANG	cmc46qlb20073twlkwsk9yxzh	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 08:17:57.239	2025-07-09 08:17:57.239
cmcvosjvb01cbtwsdq5404e78	2025-07-09	\N	2025-07-09 08:18:12.5	PULANG	cmc46qwna0089twlkok4h7czv	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 08:18:12.503	2025-07-09 08:18:12.503
cmcvoueer01cdtwsdznu8gjsa	2025-07-09	\N	2025-07-09 08:19:38.737	PULANG	cmc46qufe007xtwlk6y6ld8k6	cmck42pk6001otwsdlv11onid	2025-07-09 08:19:38.74	2025-07-09 08:19:38.74
cmcvov4n301cftwsdksyvocf6	2025-07-09	\N	2025-07-09 08:20:12.731	PULANG	cmc46qyuo008gtwlkpfrhsk5a	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 08:20:12.735	2025-07-09 08:20:12.735
cmcvozvu101cltwsdcvpwv6ol	2025-07-09	\N	2025-07-09 08:23:54.592	PULANG	cmc46pa83001dtwlkw34o2zus	cmck461f1002atwsd7hvt6jif	2025-07-09 08:23:54.601	2025-07-09 08:23:54.601
cmcvp0i3d01cntwsd505vk4r9	2025-07-09	\N	2025-07-09 08:24:23.386	PULANG	cmc46p64g000qtwlkv3exmjxb	cmck461f1002atwsd7hvt6jif	2025-07-09 08:24:23.392	2025-07-09 08:24:23.392
cmcvpodgl01d3twsd3fj8fh0a	2025-07-09	\N	2025-07-09 08:42:57.182	PULANG	cmc46sneu00eetwlk7gnrmbf8	cmck3zuvk0010twsdkc3xecuu	2025-07-09 08:42:57.189	2025-07-09 08:42:57.189
cmcvpqjj501d5twsd4sf6a7kf	2025-07-09	\N	2025-07-09 08:44:38.365	PULANG	cmc46ubh400ketwlkkfu8nopc	cmck401eu0012twsds1qwqjw4	2025-07-09 08:44:38.37	2025-07-09 08:44:38.37
cmcvq8hwo01d9twsd239zt1g3	2025-07-09	\N	2025-07-09 08:58:36.067	PULANG	cmc46tn5q00hytwlknc1ofewc	cmck3xw5t000qtwsdwrv2o0ua	2025-07-09 08:58:36.072	2025-07-09 08:58:36.072
cmcwks4j601e7twsdanhktjsf	2025-07-09	2025-07-09 23:13:40.278	\N	MASUK	cmc46p6jo000ttwlkjoqzjw5q	cmck41lu4001gtwsdh9n41hyu	2025-07-09 23:13:40.338	2025-07-09 23:13:40.338
cmcwkse9o01e9twsdwrziupjt	2025-07-09	2025-07-09 23:13:52.95	\N	MASUK	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-07-09 23:13:52.956	2025-07-09 23:13:52.956
cmcwktydm01ebtwsd3edo73vu	2025-07-09	2025-07-09 23:15:05.671	\N	MASUK	cmc46qnhi007atwlkoshg5ob4	cmck0qlgg0008twsdeysp7xwp	2025-07-09 23:15:05.674	2025-07-09 23:15:05.674
cmcwkuanj01edtwsd9xahvrer	2025-07-09	2025-07-09 23:15:21.559	\N	MASUK	cmc46r5k40091twlkc6d32ylm	cmck0qlgg0008twsdeysp7xwp	2025-07-09 23:15:21.583	2025-07-09 23:15:21.583
cmcwl07c001eftwsdej6zpgwd	2025-07-09	2025-07-09 23:19:57.202	\N	MASUK	cmc46siu100e0twlksoir3qyk	cmck3zuvk0010twsdkc3xecuu	2025-07-09 23:19:57.217	2025-07-09 23:19:57.217
cmcwl3e9w01ehtwsdpfuz0fni	2025-07-09	2025-07-09 23:22:26.172	\N	MASUK	cmc46rwds00bstwlkvna2msl2	cmck0qlgg0008twsdeysp7xwp	2025-07-09 23:22:26.18	2025-07-09 23:22:26.18
cmcwl7dbi01ejtwsdspbq7cbq	2025-07-09	2025-07-09 23:25:31.56	\N	MASUK	cmc46sneu00eetwlk7gnrmbf8	cmck3zuvk0010twsdkc3xecuu	2025-07-09 23:25:31.567	2025-07-09 23:25:31.567
cmcwldamw01eltwsddizkvj6q	2025-07-09	2025-07-09 23:30:08.019	\N	MASUK	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-07-09 23:30:08.024	2025-07-09 23:30:08.024
cmcwldgrj01entwsdtn363gex	2025-07-09	2025-07-09 23:30:15.964	\N	MASUK	cmc46ra3i009ktwlk4kxhy7zp	cmck418fo001etwsdhf12cdrj	2025-07-09 23:30:15.967	2025-07-09 23:30:15.967
cmcwlfw3s01eptwsdjn0jncrr	2025-07-09	2025-07-09 23:32:09.156	\N	MASUK	cmc46s59s00cqtwlkc8385tg3	cmck3zuvk0010twsdkc3xecuu	2025-07-09 23:32:09.16	2025-07-09 23:32:09.16
cmcwlg48501ertwsddhjvbk4r	2025-07-09	2025-07-09 23:32:19.682	\N	MASUK	cmc46s9u700d3twlkxxrzmirt	cmck3zuvk0010twsdkc3xecuu	2025-07-09 23:32:19.685	2025-07-09 23:32:19.685
cmcwlhjwu01ettwsd3tpxiu5h	2025-07-09	2025-07-09 23:33:26.666	\N	MASUK	cmc46ryle00bztwlkx7awij04	cmck3zuvk0010twsdkc3xecuu	2025-07-09 23:33:26.67	2025-07-09 23:33:26.67
cmcwlj2fg01evtwsdciphmoif	2025-07-09	2025-07-09 23:34:37.321	\N	MASUK	cmc46qufe007xtwlk6y6ld8k6	cmck42pk6001otwsdlv11onid	2025-07-09 23:34:37.324	2025-07-09 23:34:37.324
cmcwllh4s01extwsdo59t2jrz	2025-07-09	2025-07-09 23:36:29.683	\N	MASUK	cmc46p7y00012twlkan1t901y	cmc48mero00nvtwlko7dnse2m	2025-07-09 23:36:29.692	2025-07-09 23:36:29.692
cmcwllhh301eztwsdxz9idloi	2025-07-09	2025-07-09 23:36:30.13	\N	MASUK	cmc46p5ql000ntwlkqrw64rf6	cmc48mero00nvtwlko7dnse2m	2025-07-09 23:36:30.136	2025-07-09 23:36:30.136
cmcwlnkjd01f1twsdrovtxdke	2025-07-09	2025-07-09 23:38:07.414	\N	MASUK	cmc46pjq9002ptwlkdlsbonh2	cmck41lu4001gtwsdh9n41hyu	2025-07-09 23:38:07.417	2025-07-09 23:38:07.417
cmcwloboh01f3twsd8dexaxlg	2025-07-09	2025-07-09 23:38:42.589	\N	MASUK	cmc46pmrj0035twlkiohdnxpz	cmck41lu4001gtwsdh9n41hyu	2025-07-09 23:38:42.593	2025-07-09 23:38:42.593
cmcwlp1q801f5twsd3ec6lk8e	2025-07-09	2025-07-09 23:39:16.345	\N	MASUK	cmc46qgrp006ltwlkgmd3zvcp	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 23:39:16.352	2025-07-09 23:39:16.352
cmcwlpjb901f7twsd4trop19w	2025-07-09	2025-07-09 23:39:39.136	\N	MASUK	cmc46pwha004itwlkuzsyazgn	cmc48mero00nvtwlko7dnse2m	2025-07-09 23:39:39.141	2025-07-09 23:39:39.141
cmcwltud701f9twsdgo2ufwwl	2025-07-09	2025-07-09 23:43:00.086	\N	MASUK	cmc46poab003dtwlkkkqtlmi4	cmc48mero00nvtwlko7dnse2m	2025-07-09 23:43:00.091	2025-07-09 23:43:00.091
cmcwluj9y01fbtwsd5bwfmztx	2025-07-09	2025-07-09 23:43:32.37	\N	MASUK	cmc46pc16001ltwlkd7477efh	cmck468tu002ctwsd61d0pz44	2025-07-09 23:43:32.374	2025-07-09 23:43:32.374
cmcwluvbu01fdtwsddc1qz2nr	2025-07-09	2025-07-09 23:43:47.991	\N	MASUK	cmc46pghq0029twlka9885aqa	cmck468tu002ctwsd61d0pz44	2025-07-09 23:43:47.994	2025-07-09 23:43:47.994
cmcwlvmst01fftwsd5nungj1l	2025-07-09	2025-07-09 23:44:23.592	\N	MASUK	cmc46pl8k002xtwlkrv1parfp	cmck468tu002ctwsd61d0pz44	2025-07-09 23:44:23.597	2025-07-09 23:44:23.597
cmcwlw8u701fhtwsdpw1umwc4	2025-07-09	2025-07-09 23:44:52.156	\N	MASUK	cmc46ped8001ytwlkfrb06txj	cmck40wej001atwsdpzxns3dc	2025-07-09 23:44:52.159	2025-07-09 23:44:52.159
cmcwlwa7e01fjtwsdzche5n0h	2025-07-09	2025-07-09 23:44:53.924	\N	MASUK	cmc46pkez002ttwlknaeob0ip	cmck40wej001atwsdpzxns3dc	2025-07-09 23:44:53.931	2025-07-09 23:44:53.931
cmcwlxl2601fltwsdzge8b4o1	2025-07-09	2025-07-09 23:45:54.647	\N	MASUK	cmc46seaw00dhtwlknxsz3ms1	cmck40wej001atwsdpzxns3dc	2025-07-09 23:45:54.654	2025-07-09 23:45:54.654
cmcwly59p01fntwsdut32inhg	2025-07-09	2025-07-09 23:46:20.841	\N	MASUK	cmc46phg0002dtwlkt8tcx2ia	cmck40wej001atwsdpzxns3dc	2025-07-09 23:46:20.845	2025-07-09 23:46:20.845
cmcwm4xi201fptwsdx7dg1tek	2025-07-09	2025-07-09 23:51:37.366	\N	MASUK	cmc46s31000cdtwlkt2zewnu5	cmck413cb001ctwsddb4r6abm	2025-07-09 23:51:37.371	2025-07-09 23:51:37.371
cmcwm7toy01frtwsdxp2brg1n	2025-07-09	2025-07-09 23:53:52.398	\N	MASUK	cmc46sgjj00dttwlk2n9q1jja	cmc48n8mc00nztwlkq8l3p7ok	2025-07-09 23:53:52.402	2025-07-09 23:53:52.402
cmcwman0001fttwsdtrv4zykl	2025-07-09	2025-07-09 23:56:03.692	\N	MASUK	cmc46qyuo008gtwlkpfrhsk5a	cmc48mqk900nxtwlkpuu6o5zz	2025-07-09 23:56:03.696	2025-07-09 23:56:03.696
cmcwmdlcy01fvtwsdgkw2avjm	2025-07-09	2025-07-09 23:58:21.535	\N	MASUK	cmc46p64g000qtwlkv3exmjxb	cmck461f1002atwsd7hvt6jif	2025-07-09 23:58:21.538	2025-07-09 23:58:21.538
cmcwmejqr01fxtwsdd3g4yzm7	2025-07-09	2025-07-09 23:59:06.096	\N	MASUK	cmc46pa83001dtwlkw34o2zus	cmck461f1002atwsd7hvt6jif	2025-07-09 23:59:06.099	2025-07-09 23:59:06.099
cmcwmfpjf01fztwsdjr9z8cas	2025-07-10	2025-07-10 00:00:00.26	\N	MASUK	cmc46ubh400ketwlkkfu8nopc	cmck401eu0012twsds1qwqjw4	2025-07-10 00:00:00.267	2025-07-10 00:00:00.267
cmcwmjdjk01g1twsd06xka7co	2025-07-10	2025-07-10 00:02:51.341	\N	MASUK	cmc46tn5q00hytwlknc1ofewc	cmck3xw5t000qtwsdwrv2o0ua	2025-07-10 00:02:51.344	2025-07-10 00:02:51.344
cmcwmn6nk01g5twsdw9me2rj0	2025-07-10	2025-07-10 00:05:49.036	\N	MASUK	cmc46tiru00hktwlk85dmpfyh	cmck45utb0028twsd8uf3m0ef	2025-07-10 00:05:49.041	2025-07-10 00:05:49.041
cmcwmntdj01g7twsdf4xr19sk	2025-07-10	2025-07-10 00:06:18.485	\N	MASUK	cmc46v45w00ndtwlk563qy6nd	cmck406q40014twsd4gqd9j1a	2025-07-10 00:06:18.487	2025-07-10 00:06:18.487
cmcwmnuh001g9twsd9dmqy58b	2025-07-10	2025-07-10 00:06:19.905	\N	MASUK	cmc46uopi00lutwlk6ky20hrv	cmck406q40014twsd4gqd9j1a	2025-07-10 00:06:19.908	2025-07-10 00:06:19.908
cmcwmuezf01gbtwsd7qfa8odj	2025-07-10	2025-07-10 00:11:26.423	\N	MASUK	cmc46pnhf003atwlk0zw4shj9	cmck439di001utwsdypps76dc	2025-07-10 00:11:26.427	2025-07-10 00:11:26.427
cmcwn0dw101gdtwsdmqt6cpu4	2025-07-10	2025-07-10 00:16:04.943	\N	MASUK	cmc46qj48006wtwlkxjg53s62	cmck40i2v0018twsdmoshgxtd	2025-07-10 00:16:04.946	2025-07-10 00:16:04.946
cmcwn11qs01gftwsddb6up921	2025-07-10	2025-07-10 00:16:35.854	\N	MASUK	cmc46r7ti009dtwlkxkev0j8x	cmck40i2v0018twsdmoshgxtd	2025-07-10 00:16:35.86	2025-07-10 00:16:35.86
cmcwn1uza01ghtwsdgcepwpof	2025-07-10	2025-07-10 00:17:13.746	\N	MASUK	cmc46r3af008utwlkutramzmy	cmck40i2v0018twsdmoshgxtd	2025-07-10 00:17:13.751	2025-07-10 00:17:13.751
cmcwn6frn01gltwsd1vt6rct0	2025-07-10	2025-07-10 00:20:47.307	\N	MASUK	cmc46rpmn00b3twlk3kcu7mik	cmck40wej001atwsdpzxns3dc	2025-07-10 00:20:47.315	2025-07-10 00:20:47.315
cmcwnc3ph01gptwsd4fis3601	2025-07-10	2025-07-10 00:25:11.618	\N	MASUK	cmc46ttvb00iotwlkamx55iuo	cmck0vrtn000gtwsdjzf0zz94	2025-07-10 00:25:11.621	2025-07-10 00:25:11.621
cmcwnisy201gttwsde6gfq64t	2025-07-10	2025-07-10 00:30:24.261	\N	MASUK	cmc46rixs00aitwlkpg86h565	cmck40wej001atwsdpzxns3dc	2025-07-10 00:30:24.266	2025-07-10 00:30:24.266
cmcwnjmkh01gvtwsdorpxl9ws	2025-07-10	2025-07-10 00:31:02.653	\N	MASUK	cmc46ru3200bhtwlkqx7b7u7h	cmck40wej001atwsdpzxns3dc	2025-07-10 00:31:02.657	2025-07-10 00:31:02.657
cmcwnpulv01gxtwsds27nhx2w	2025-07-10	2025-07-10 00:35:53.004	\N	MASUK	cmc46qlb20073twlkwsk9yxzh	cmc48mqk900nxtwlkpuu6o5zz	2025-07-10 00:35:53.011	2025-07-10 00:35:53.011
cmcwprpg501h5twsdt5fqfdyj	2025-07-10	2025-07-10 01:33:18.864	\N	MASUK	cmc46q15w0052twlkhtfrzd6q	cmck4dzm8002gtwsdwfchlzo8	2025-07-10 01:33:18.87	2025-07-10 01:33:18.87
cmcwps4by01h7twsd7bpvv6o3	2025-07-10	2025-07-10 01:33:38.154	\N	MASUK	cmc46q3kk005dtwlk36s2a65a	cmck4dzm8002gtwsdwfchlzo8	2025-07-10 01:33:38.158	2025-07-10 01:33:38.158
cmcwpsdwd01h9twsdsgex72ez	2025-07-10	2025-07-10 01:33:50.553	\N	MASUK	cmc46pt0l0041twlk75hwckll	cmck4dzm8002gtwsdwfchlzo8	2025-07-10 01:33:50.557	2025-07-10 01:33:50.557
cmcwpu7zx01hntwsd24swllgv	2025-07-10	2025-07-10 01:35:16.214	\N	MASUK	cmc46q2rq005atwlks6oghu8m	cmck4dzm8002gtwsdwfchlzo8	2025-07-10 01:35:16.221	2025-07-10 01:35:16.221
cmcwq2wrf01hptwsdnvhr51vs	2025-07-10	2025-07-10 01:42:01.556	\N	MASUK	cmc46pdme001utwlksga35tj7	cmck41lu4001gtwsdh9n41hyu	2025-07-10 01:42:01.563	2025-07-10 01:42:01.563
cmcx1v80101ijtwsdjyagcwr8	2025-07-10	\N	2025-07-10 07:11:58.27	PULANG	cmc46pdme001utwlksga35tj7	cmck41lu4001gtwsdh9n41hyu	2025-07-10 07:11:58.273	2025-07-10 07:11:58.273
cmcx2msu801intwsd9kdg6u62	2025-07-10	\N	2025-07-10 07:33:24.989	PULANG	cmc46q5ev005jtwlkm0nl2m8g	cmck418fo001etwsdhf12cdrj	2025-07-10 07:33:24.992	2025-07-10 07:33:24.992
cmcx338ay01irtwsdwjtlz2tt	2025-07-10	\N	2025-07-10 07:46:11.525	PULANG	cmc46ru3200bhtwlkqx7b7u7h	cmck40wej001atwsdpzxns3dc	2025-07-10 07:46:11.53	2025-07-10 07:46:11.53
cmcx33euk01ittwsds6fbj300	2025-07-10	\N	2025-07-10 07:46:20.009	PULANG	cmc46seaw00dhtwlknxsz3ms1	cmck40wej001atwsdpzxns3dc	2025-07-10 07:46:20.012	2025-07-10 07:46:20.012
cmcx3hods01j3twsdfww8cryz	2025-07-10	\N	2025-07-10 07:57:25.55	PULANG	cmc46qc9w0067twlkcuynnxtk	cmck0qlgg0008twsdeysp7xwp	2025-07-10 07:57:25.553	2025-07-10 07:57:25.553
cmcx3l50g01j7twsdbfydn7ps	2025-07-10	\N	2025-07-10 08:00:07.07	PULANG	cmc46poab003dtwlkkkqtlmi4	cmc48mero00nvtwlko7dnse2m	2025-07-10 08:00:07.073	2025-07-10 08:00:07.073
cmcx3lgee01j9twsdxro9r1th	2025-07-10	\N	2025-07-10 08:00:21.828	PULANG	cmc46pwha004itwlkuzsyazgn	cmc48mero00nvtwlko7dnse2m	2025-07-10 08:00:21.831	2025-07-10 08:00:21.831
cmcx3nes101jftwsdh2vls0wi	2025-07-10	\N	2025-07-10 08:01:53.039	PULANG	cmc46qj48006wtwlkxjg53s62	cmck40i2v0018twsdmoshgxtd	2025-07-10 08:01:53.042	2025-07-10 08:01:53.042
cmcx3npbx01jjtwsdjg3yendk	2025-07-10	\N	2025-07-10 08:02:06.714	PULANG	cmc46r3af008utwlkutramzmy	cmck40i2v0018twsdmoshgxtd	2025-07-10 08:02:06.717	2025-07-10 08:02:06.717
cmcx3o37101jltwsd05j3w1qx	2025-07-10	\N	2025-07-10 08:02:24.68	PULANG	cmc46r7ti009dtwlkxkev0j8x	cmck40i2v0018twsdmoshgxtd	2025-07-10 08:02:24.685	2025-07-10 08:02:24.685
cmcx5abc801k3twsdqcgpaq0i	2025-07-10	\N	2025-07-10 08:47:41.283	PULANG	cmc46tiru00hktwlk85dmpfyh	cmck45utb0028twsd8uf3m0ef	2025-07-10 08:47:41.288	2025-07-10 08:47:41.288
cmcx5eyog01k5twsd8zbb4lkz	2025-07-10	\N	2025-07-10 08:51:18.157	PULANG	cmc46v45w00ndtwlk563qy6nd	cmck406q40014twsd4gqd9j1a	2025-07-10 08:51:18.16	2025-07-10 08:51:18.16
cmcx5phjo01k9twsdo6jucaiz	2025-07-10	\N	2025-07-10 08:59:29.168	PULANG	cmc46sufy00f1twlkyabfajk9	cmck406q40014twsd4gqd9j1a	2025-07-10 08:59:29.172	2025-07-10 08:59:29.172
cmcx5pmm201kbtwsdao8jq1xj	2025-07-10	\N	2025-07-10 08:59:35.736	PULANG	cmc46uopi00lutwlk6ky20hrv	cmck406q40014twsd4gqd9j1a	2025-07-10 08:59:35.738	2025-07-10 08:59:35.738
cmcx5qe0r01kdtwsdt38e3lzx	2025-07-10	\N	2025-07-10 09:00:11.256	PULANG	cmc46swpg00fetwlkx51xpyx3	cmck406q40014twsd4gqd9j1a	2025-07-10 09:00:11.26	2025-07-10 09:00:11.26
cmcxzu5b401ljtwsdlhe5d3zl	2025-07-10	2025-07-10 23:02:55.024	\N	MASUK	cmc46tkyl00hrtwlkewcqik62	cmck0tens000atwsdmwj9xk2w	2025-07-10 23:02:55.072	2025-07-10 23:02:55.072
cmcy0748701lltwsdi347ai68	2025-07-10	2025-07-10 23:13:00.189	\N	MASUK	cmc46p6jo000ttwlkjoqzjw5q	cmck41lu4001gtwsdh9n41hyu	2025-07-10 23:13:00.199	2025-07-10 23:13:00.199
cmcy08hns01lntwsdgllgxej5	2025-07-10	2025-07-10 23:14:04.262	\N	MASUK	cmc46pjq9002ptwlkdlsbonh2	cmck41lu4001gtwsdh9n41hyu	2025-07-10 23:14:04.265	2025-07-10 23:14:04.265
cmcy094zk01lptwsdxhw3z46o	2025-07-10	2025-07-10 23:14:34.494	\N	MASUK	cmc46trp000ihtwlkk9doz5ah	cmca53cvo00o5twlke9erzxzp	2025-07-10 23:14:34.496	2025-07-10 23:14:34.496
cmcy0fsav01lrtwsdk9o893fi	2025-07-10	2025-07-10 23:19:44.643	\N	MASUK	cmc46qufe007xtwlk6y6ld8k6	cmck42pk6001otwsdlv11onid	2025-07-10 23:19:44.647	2025-07-10 23:19:44.647
cmcy0k7un01lttwsdgwxinuzy	2025-07-10	2025-07-10 23:23:11.42	\N	MASUK	cmc46siu100e0twlksoir3qyk	cmck3zuvk0010twsdkc3xecuu	2025-07-10 23:23:11.423	2025-07-10 23:23:11.423
cmcy0k9oi01lvtwsd9s5xi9wu	2025-07-10	2025-07-10 23:23:13.791	\N	MASUK	cmc46sneu00eetwlk7gnrmbf8	cmck3zuvk0010twsdkc3xecuu	2025-07-10 23:23:13.794	2025-07-10 23:23:13.794
cmcy0l2e301lxtwsdjxodkcws	2025-07-10	2025-07-10 23:23:51.001	\N	MASUK	cmc46rwds00bstwlkvna2msl2	cmck0qlgg0008twsdeysp7xwp	2025-07-10 23:23:51.004	2025-07-10 23:23:51.004
cmcy0luub01lztwsdxv8c5mqv	2025-07-10	2025-07-10 23:24:27.872	\N	MASUK	cmc46qc9w0067twlkcuynnxtk	cmck0qlgg0008twsdeysp7xwp	2025-07-10 23:24:27.875	2025-07-10 23:24:27.875
cmcy0v5lt01m1twsds6kphwf9	2025-07-10	2025-07-10 23:31:41.725	\N	MASUK	cmc46pmrj0035twlkiohdnxpz	cmck41lu4001gtwsdh9n41hyu	2025-07-10 23:31:41.729	2025-07-10 23:31:41.729
cmcy0xzqr01m3twsdv68f5oni	2025-07-10	2025-07-10 23:33:54.097	\N	MASUK	cmc46s59s00cqtwlkc8385tg3	cmck3zuvk0010twsdkc3xecuu	2025-07-10 23:33:54.1	2025-07-10 23:33:54.1
cmcy0yg6e01m5twsdt1wqjv4i	2025-07-10	2025-07-10 23:34:15.396	\N	MASUK	cmc46s9u700d3twlkxxrzmirt	cmck3zuvk0010twsdkc3xecuu	2025-07-10 23:34:15.398	2025-07-10 23:34:15.398
cmcy15lnc01m7twsdg4dkkglx	2025-07-10	2025-07-10 23:39:49.078	\N	MASUK	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-07-10 23:39:49.081	2025-07-10 23:39:49.081
cmcy1826m01m9twsdny95pkq5	2025-07-10	2025-07-10 23:41:43.819	\N	MASUK	cmc46qeik006etwlk22jwlw57	cmck42pk6001otwsdlv11onid	2025-07-10 23:41:43.823	2025-07-10 23:41:43.823
cmcy1aw6e01mbtwsdwzvdvzdq	2025-07-10	2025-07-10 23:43:56.002	\N	MASUK	cmc46sl0j00e7twlkracec5rj	cmck0qlgg0008twsdeysp7xwp	2025-07-10 23:43:56.006	2025-07-10 23:43:56.006
cmcy1b0lj01mdtwsd07k7klra	2025-07-10	2025-07-10 23:44:01.732	\N	MASUK	cmc46ryle00bztwlkx7awij04	cmck3zuvk0010twsdkc3xecuu	2025-07-10 23:44:01.736	2025-07-10 23:44:01.736
cmcy1bh0901mftwsd0zhtthc3	2025-07-10	2025-07-10 23:44:22.999	\N	MASUK	cmc46ra3i009ktwlk4kxhy7zp	cmck418fo001etwsdhf12cdrj	2025-07-10 23:44:23.001	2025-07-10 23:44:23.001
cmcy1bmly01mhtwsdimt5zysj	2025-07-10	2025-07-10 23:44:30.256	\N	MASUK	cmc46uzp400mttwlk0oazh0s3	cmck401eu0012twsds1qwqjw4	2025-07-10 23:44:30.262	2025-07-10 23:44:30.262
cmcy1em5j01mjtwsd583tnne6	2025-07-10	2025-07-10 23:46:49.636	\N	MASUK	cmc46ped8001ytwlkfrb06txj	cmck40wej001atwsdpzxns3dc	2025-07-10 23:46:49.639	2025-07-10 23:46:49.639
cmcy1et3h01mltwsdjntf1e8p	2025-07-10	2025-07-10 23:46:58.63	\N	MASUK	cmc46sgjj00dttwlk2n9q1jja	cmc48n8mc00nztwlkq8l3p7ok	2025-07-10 23:46:58.637	2025-07-10 23:46:58.637
cmcy1fh7x01mntwsds4vq5p6c	2025-07-10	2025-07-10 23:47:29.898	\N	MASUK	cmc46seaw00dhtwlknxsz3ms1	cmck40wej001atwsdpzxns3dc	2025-07-10 23:47:29.901	2025-07-10 23:47:29.901
cmcy1fjqg01mptwsdqtbena3z	2025-07-10	2025-07-10 23:47:33.158	\N	MASUK	cmc46phg0002dtwlkt8tcx2ia	cmck40wej001atwsdpzxns3dc	2025-07-10 23:47:33.161	2025-07-10 23:47:33.161
cmcy1gl2w01mrtwsdmxkp8liu	2025-07-10	2025-07-10 23:48:21.558	\N	MASUK	cmc46pkez002ttwlknaeob0ip	cmck40wej001atwsdpzxns3dc	2025-07-10 23:48:21.561	2025-07-10 23:48:21.561
cmcy1gp7501mttwsd9pov35ll	2025-07-10	2025-07-10 23:48:26.894	\N	MASUK	cmc46pc16001ltwlkd7477efh	cmck468tu002ctwsd61d0pz44	2025-07-10 23:48:26.897	2025-07-10 23:48:26.897
cmcy1h24601mvtwsd8dehnvko	2025-07-10	2025-07-10 23:48:43.634	\N	MASUK	cmc46pghq0029twlka9885aqa	cmck468tu002ctwsd61d0pz44	2025-07-10 23:48:43.638	2025-07-10 23:48:43.638
cmcy1ix0x01mxtwsdr20i0uad	2025-07-10	2025-07-10 23:50:10.35	\N	MASUK	cmc46v8mu00nrtwlkm3c62zp1	cmck3xw5t000qtwsdwrv2o0ua	2025-07-10 23:50:10.353	2025-07-10 23:50:10.353
cmcy1ob3k01mztwsdljcn7gq4	2025-07-10	2025-07-10 23:54:21.868	\N	MASUK	cmc46pl8k002xtwlkrv1parfp	cmck468tu002ctwsd61d0pz44	2025-07-10 23:54:21.872	2025-07-10 23:54:21.872
cmcy1xdg501n1twsdercaf7w3	2025-07-11	2025-07-11 00:01:24.816	\N	MASUK	cmc46r5k40091twlkc6d32ylm	cmck0qlgg0008twsdeysp7xwp	2025-07-11 00:01:24.821	2025-07-11 00:01:24.821
cmcy204sq01n5twsd9c5do4s7	2025-07-11	2025-07-11 00:03:33.575	\N	MASUK	cmc46qnhi007atwlkoshg5ob4	cmck0qlgg0008twsdeysp7xwp	2025-07-11 00:03:33.578	2025-07-11 00:03:33.578
cmcy208tc01n7twsd2qlaxm8a	2025-07-11	2025-07-11 00:03:38.782	\N	MASUK	cmc46udog00kltwlk8mp3jpsw	cmck3xw5t000qtwsdwrv2o0ua	2025-07-11 00:03:38.785	2025-07-11 00:03:38.785
cmcy2pwei01n9twsd4qy5y85v	2025-07-11	2025-07-11 00:23:35.746	\N	MASUK	cmc46p6zu000wtwlk8cv819k1	cmck58yj9002itwsdcqhqroi1	2025-07-11 00:23:35.754	2025-07-11 00:23:35.754
cmcy2t6rk01ndtwsdqwsudlt2	2025-07-11	2025-07-11 00:26:09.148	\N	MASUK	cmc46pfw20026twlkeuha5zir	cmck0uy49000ctwsdmr363t36	2025-07-11 00:26:09.152	2025-07-11 00:26:09.152
cmcy2yrt901nftwsdgcfasu6s	2025-07-11	2025-07-11 00:30:29.705	\N	MASUK	cmc46pq1s003ltwlkhuevqi62	cmck44fxi0022twsdqewf2qfz	2025-07-11 00:30:29.709	2025-07-11 00:30:29.709
cmcy3brsq01nhtwsdrw1dmkeq	2025-07-11	2025-07-11 00:40:36.216	\N	MASUK	cmc46p64g000qtwlkv3exmjxb	cmck461f1002atwsd7hvt6jif	2025-07-11 00:40:36.219	2025-07-11 00:40:36.219
cmcy3cg9l01njtwsd7054qvsm	2025-07-11	2025-07-11 00:41:07.927	\N	MASUK	cmc46pa83001dtwlkw34o2zus	cmck461f1002atwsd7hvt6jif	2025-07-11 00:41:07.93	2025-07-11 00:41:07.93
cmcy3fnbz01nltwsdwqbscm8g	2025-07-11	2025-07-11 00:43:37.052	\N	MASUK	cmc46uva300mftwlk0yfyi1q9	cmck3y53f000stwsdvoovf2pk	2025-07-11 00:43:37.055	2025-07-11 00:43:37.055
cmcy3ujm501nntwsdcsh6b309	2025-07-11	2025-07-11 00:55:12.075	\N	MASUK	cmc46poab003dtwlkkkqtlmi4	cmc48mero00nvtwlko7dnse2m	2025-07-11 00:55:12.078	2025-07-11 00:55:12.078
cmcy3uzjp01nptwsdwnowoa5k	2025-07-11	2025-07-11 00:55:32.723	\N	MASUK	cmc46p5ql000ntwlkqrw64rf6	cmc48mero00nvtwlko7dnse2m	2025-07-11 00:55:32.725	2025-07-11 00:55:32.725
cmcy3ytj601nrtwsdhfgrnurl	2025-07-11	2025-07-11 00:58:31.551	\N	MASUK	cmc46pwha004itwlkuzsyazgn	cmc48mero00nvtwlko7dnse2m	2025-07-11 00:58:31.555	2025-07-11 00:58:31.555
cmcy44x2y01nttwsdmiloijdw	2025-07-11	2025-07-11 01:03:16.088	\N	MASUK	cmc46sc4a00datwlklba5fy78	cmck435iu001stwsdbk5h55wi	2025-07-11 01:03:16.09	2025-07-11 01:03:16.09
cmcy4j1ee01nvtwsdz9mcutkx	2025-07-11	2025-07-11 01:14:14.868	\N	MASUK	cmc46qwna0089twlkok4h7czv	cmc48mqk900nxtwlkpuu6o5zz	2025-07-11 01:14:14.871	2025-07-11 01:14:14.871
cmcy4ld6t01nxtwsd252lj8bh	2025-07-11	2025-07-11 01:16:03.457	\N	MASUK	cmc46qgrp006ltwlkgmd3zvcp	cmc48mqk900nxtwlkpuu6o5zz	2025-07-11 01:16:03.461	2025-07-11 01:16:03.461
cmcy66bx901o3twsdh66kth6k	2025-07-11	2025-07-11 02:00:21.207	\N	MASUK	cmc46q5ev005jtwlkm0nl2m8g	cmck418fo001etwsdhf12cdrj	2025-07-11 02:00:21.213	2025-07-11 02:00:21.213
cmcy66mpk01o5twsdu9u23xp7	2025-07-11	2025-07-11 02:00:35.189	\N	MASUK	cmc46q7m6005qtwlksgmx27n4	cmc48mqk900nxtwlkpuu6o5zz	2025-07-11 02:00:35.192	2025-07-11 02:00:35.192
cmcy66ria01o7twsdz8vs6uk2	2025-07-11	2025-07-11 02:00:41.406	\N	MASUK	cmc46qyuo008gtwlkpfrhsk5a	cmc48mqk900nxtwlkpuu6o5zz	2025-07-11 02:00:41.411	2025-07-11 02:00:41.411
cmcy66zz401o9twsdhak85ajx	2025-07-11	2025-07-11 02:00:52.38	\N	MASUK	cmc46qs78007qtwlkv76qqm1t	cmc48mqk900nxtwlkpuu6o5zz	2025-07-11 02:00:52.384	2025-07-11 02:00:52.384
cmcycu0x501ortwsdrhzc0rte	2025-07-11	\N	2025-07-11 05:06:44.389	PULANG	cmc46qeik006etwlk22jwlw57	cmck42pk6001otwsdlv11onid	2025-07-11 05:06:44.393	2025-07-11 05:06:44.393
cmcydk63t01ottwsdsghp3cyg	2025-07-11	\N	2025-07-11 05:27:04.165	PULANG	cmc46ttvb00iotwlkamx55iuo	cmck0vrtn000gtwsdjzf0zz94	2025-07-11 05:27:04.169	2025-07-11 05:27:04.169
cmcyf9xge01oztwsdxm31jbuw	2025-07-11	\N	2025-07-11 06:15:05.624	PULANG	cmc46qufe007xtwlk6y6ld8k6	cmck42pk6001otwsdlv11onid	2025-07-11 06:15:05.631	2025-07-11 06:15:05.631
cmcyg56f401p9twsdok9kbxel	2025-07-11	\N	2025-07-11 06:39:23.58	PULANG	cmc46ryle00bztwlkx7awij04	cmck3zuvk0010twsdkc3xecuu	2025-07-11 06:39:23.585	2025-07-11 06:39:23.585
cmcygj0o501pftwsdhu7m5vfb	2025-07-11	\N	2025-07-11 06:50:09.311	PULANG	cmc46pctz001ptwlko6va5kot	cmc48rtmy00o1twlk3uhabwd0	2025-07-11 06:50:09.317	2025-07-11 06:50:09.317
cmcygj80901phtwsdhijuq9mu	2025-07-11	\N	2025-07-11 06:50:18.823	PULANG	cmc46pi7s002htwlk9tebi51u	cmc48rtmy00o1twlk3uhabwd0	2025-07-11 06:50:18.825	2025-07-11 06:50:18.825
cmcygmrpu01pntwsd7tbox575	2025-07-11	\N	2025-07-11 06:53:04.335	PULANG	cmc46qnhi007atwlkoshg5ob4	cmck0qlgg0008twsdeysp7xwp	2025-07-11 06:53:04.338	2025-07-11 06:53:04.338
cmcygntge01pptwsd8o1i04pb	2025-07-11	\N	2025-07-11 06:53:53.244	PULANG	cmc46r5k40091twlkc6d32ylm	cmck0qlgg0008twsdeysp7xwp	2025-07-11 06:53:53.246	2025-07-11 06:53:53.246
cmcygoci601prtwsdbs5gd3qj	2025-07-11	\N	2025-07-11 06:54:17.931	PULANG	cmc46pkez002ttwlknaeob0ip	cmck40wej001atwsdpzxns3dc	2025-07-11 06:54:17.934	2025-07-11 06:54:17.934
cmcygp4dd01pttwsd53gwwvoi	2025-07-11	\N	2025-07-11 06:54:54.047	PULANG	cmc46rixs00aitwlkpg86h565	cmck40wej001atwsdpzxns3dc	2025-07-11 06:54:54.05	2025-07-11 06:54:54.05
cmcygr8p501pvtwsdk7nm84ks	2025-07-11	\N	2025-07-11 06:56:32.966	PULANG	cmc46rwds00bstwlkvna2msl2	cmck0qlgg0008twsdeysp7xwp	2025-07-11 06:56:32.97	2025-07-11 06:56:32.97
cmcygvahg01q3twsd5qr1sbow	2025-07-11	\N	2025-07-11 06:59:41.905	PULANG	cmc46s31000cdtwlkt2zewnu5	cmck413cb001ctwsddb4r6abm	2025-07-11 06:59:41.908	2025-07-11 06:59:41.908
cmcygvuef01q7twsdbswa4eth	2025-07-11	\N	2025-07-11 07:00:07.713	PULANG	cmc46q7m6005qtwlksgmx27n4	cmc48mqk900nxtwlkpuu6o5zz	2025-07-11 07:00:07.719	2025-07-11 07:00:07.719
cmcygvw6401q9twsdvcr9xevs	2025-07-11	\N	2025-07-11 07:00:10.009	PULANG	cmc46qs78007qtwlkv76qqm1t	cmc48mqk900nxtwlkpuu6o5zz	2025-07-11 07:00:10.012	2025-07-11 07:00:10.012
cmcygvzwd01qbtwsdcdxfx2xz	2025-07-11	\N	2025-07-11 07:00:14.842	PULANG	cmc46sl0j00e7twlkracec5rj	cmck0qlgg0008twsdeysp7xwp	2025-07-11 07:00:14.845	2025-07-11 07:00:14.845
cmcygx8he01qftwsdwmze27dk	2025-07-11	\N	2025-07-11 07:01:12.619	PULANG	cmc46qwna0089twlkok4h7czv	cmc48mqk900nxtwlkpuu6o5zz	2025-07-11 07:01:12.626	2025-07-11 07:01:12.626
cmcygxemk01qhtwsd4g9yga9d	2025-07-11	\N	2025-07-11 07:01:20.584	PULANG	cmc46qlb20073twlkwsk9yxzh	cmc48mqk900nxtwlkpuu6o5zz	2025-07-11 07:01:20.588	2025-07-11 07:01:20.588
cmcygxnuj01qjtwsdvfbcmply	2025-07-11	\N	2025-07-11 07:01:32.536	PULANG	cmc46ped8001ytwlkfrb06txj	cmck40wej001atwsdpzxns3dc	2025-07-11 07:01:32.539	2025-07-11 07:01:32.539
cmcygycqv01qrtwsdjstiyyam	2025-07-11	\N	2025-07-11 07:02:04.804	PULANG	cmc46siu100e0twlksoir3qyk	cmck3zuvk0010twsdkc3xecuu	2025-07-11 07:02:04.807	2025-07-11 07:02:04.807
cmcygz0yk01qttwsdjja74lmy	2025-07-11	\N	2025-07-11 07:02:36.186	PULANG	cmc46s59s00cqtwlkc8385tg3	cmck3zuvk0010twsdkc3xecuu	2025-07-11 07:02:36.189	2025-07-11 07:02:36.189
cmcyh14h501qvtwsdcokfqrbf	2025-07-11	\N	2025-07-11 07:04:14.053	PULANG	cmc46pghq0029twlka9885aqa	cmck468tu002ctwsd61d0pz44	2025-07-11 07:04:14.057	2025-07-11 07:04:14.057
cmcyh1f0p01qxtwsdt0qierbz	2025-07-11	\N	2025-07-11 07:04:27.717	PULANG	cmc46pl8k002xtwlkrv1parfp	cmck468tu002ctwsd61d0pz44	2025-07-11 07:04:27.721	2025-07-11 07:04:27.721
cmcyh21aw01qztwsdenyianog	2025-07-11	\N	2025-07-11 07:04:56.596	PULANG	cmc46pc16001ltwlkd7477efh	cmck468tu002ctwsd61d0pz44	2025-07-11 07:04:56.6	2025-07-11 07:04:56.6
cmcyh3w7t01r3twsd5ow613bj	2025-07-11	\N	2025-07-11 07:06:23.312	PULANG	cmc46p6jo000ttwlkjoqzjw5q	cmck41lu4001gtwsdh9n41hyu	2025-07-11 07:06:23.322	2025-07-11 07:06:23.322
cmcyh9tfy01r5twsdhk7mwr12	2025-07-11	\N	2025-07-11 07:10:59.659	PULANG	cmc46s9u700d3twlkxxrzmirt	cmck3zuvk0010twsdkc3xecuu	2025-07-11 07:10:59.662	2025-07-11 07:10:59.662
cmcyh9va801r7twsdwgyr9gj7	2025-07-11	\N	2025-07-11 07:11:02.043	PULANG	cmc46rpmn00b3twlk3kcu7mik	cmck40wej001atwsdpzxns3dc	2025-07-11 07:11:02.048	2025-07-11 07:11:02.048
cmcyhiat001rdtwsduq2y4utk	2025-07-11	\N	2025-07-11 07:17:35.41	PULANG	cmc46p5ql000ntwlkqrw64rf6	cmc48mero00nvtwlko7dnse2m	2025-07-11 07:17:35.413	2025-07-11 07:17:35.413
cmcyhjsll01rhtwsdte7gtfyj	2025-07-11	\N	2025-07-11 07:18:45.124	PULANG	cmc46p7y00012twlkan1t901y	cmc48mero00nvtwlko7dnse2m	2025-07-11 07:18:45.129	2025-07-11 07:18:45.129
cmcyhkhbk01rjtwsde1017a3d	2025-07-11	\N	2025-07-11 07:19:17.165	PULANG	cmc46rgo400a5twlk8xzlphlx	cmc48mqk900nxtwlkpuu6o5zz	2025-07-11 07:19:17.168	2025-07-11 07:19:17.168
cmcyhz36c01rttwsd2iypv4zx	2025-07-11	\N	2025-07-11 07:30:38.672	PULANG	cmc46pjq9002ptwlkdlsbonh2	cmck41lu4001gtwsdh9n41hyu	2025-07-11 07:30:38.676	2025-07-11 07:30:38.676
cmcyhzain01rvtwsdua7x06mf	2025-07-11	\N	2025-07-11 07:30:48.188	PULANG	cmc46ra3i009ktwlk4kxhy7zp	cmck418fo001etwsdhf12cdrj	2025-07-11 07:30:48.191	2025-07-11 07:30:48.191
cmcyiqpxy01rztwsdbnzgcbhu	2025-07-11	\N	2025-07-11 07:52:07.881	PULANG	cmc46pmrj0035twlkiohdnxpz	cmck41lu4001gtwsdh9n41hyu	2025-07-11 07:52:07.894	2025-07-11 07:52:07.894
cmcyjak7i01s3twsdi82u7c4y	2025-07-11	\N	2025-07-11 08:07:33.577	PULANG	cmc46qyuo008gtwlkpfrhsk5a	cmc48mqk900nxtwlkpuu6o5zz	2025-07-11 08:07:33.582	2025-07-11 08:07:33.582
cmcyjttal01s9twsd4gbay3rb	2025-07-11	\N	2025-07-11 08:22:31.817	PULANG	cmc46p6zu000wtwlk8cv819k1	cmck58yj9002itwsdcqhqroi1	2025-07-11 08:22:31.821	2025-07-11 08:22:31.821
cmcykb3z101sftwsd8hbfxv35	2025-07-11	\N	2025-07-11 08:35:58.809	PULANG	cmc46p64g000qtwlkv3exmjxb	cmck461f1002atwsd7hvt6jif	2025-07-11 08:35:58.814	2025-07-11 08:35:58.814
cmcykhqpg01shtwsd1v8pg890	2025-07-11	\N	2025-07-11 08:41:08.206	PULANG	cmc46tkyl00hrtwlkewcqik62	cmck0tens000atwsdmwj9xk2w	2025-07-11 08:41:08.212	2025-07-11 08:41:08.212
cmcykvmnm01sjtwsdcrpkom8l	2025-07-11	\N	2025-07-11 08:51:56.144	PULANG	cmc46qpxp007jtwlkmf7x9mjw	cmck42pk6001otwsdlv11onid	2025-07-11 08:51:56.147	2025-07-11 08:51:56.147
cmcykxdm301sntwsd6vjb9zk5	2025-07-11	\N	2025-07-11 08:53:17.737	PULANG	cmc46uva300mftwlk0yfyi1q9	cmck3y53f000stwsdvoovf2pk	2025-07-11 08:53:17.739	2025-07-11 08:53:17.739
cmcykypre01sptwsd5hvmmsz7	2025-07-11	\N	2025-07-11 08:54:20.136	PULANG	cmc46ubh400ketwlkkfu8nopc	cmck401eu0012twsds1qwqjw4	2025-07-11 08:54:20.139	2025-07-11 08:54:20.139
cmczg6sc501tftwsdjs110pui	2025-07-11	2025-07-11 23:28:24.76	\N	MASUK	cmc46t5kl00g8twlkurga8kks	cmck0vrtn000gtwsdjzf0zz94	2025-07-11 23:28:24.821	2025-07-11 23:28:24.821
cmczgxudf01thtwsd6bl8yu6z	2025-07-11	2025-07-11 23:49:27.165	\N	MASUK	cmc46ttvb00iotwlkamx55iuo	cmck0vrtn000gtwsdjzf0zz94	2025-07-11 23:49:27.171	2025-07-11 23:49:27.171
cmczh6r5a01tjtwsdm7jn6hcu	2025-07-11	2025-07-11 23:56:22.888	\N	MASUK	cmc46tiru00hktwlk85dmpfyh	cmck45utb0028twsd8uf3m0ef	2025-07-11 23:56:22.894	2025-07-11 23:56:22.894
cmczh80n301tltwsd43ce5ty9	2025-07-11	2025-07-11 23:57:21.852	\N	MASUK	cmc46tkyl00hrtwlkewcqik62	cmck0tens000atwsdmwj9xk2w	2025-07-11 23:57:21.856	2025-07-11 23:57:21.856
cmczhcupq01tntwsdzic2u8ns	2025-07-12	2025-07-12 00:01:07.451	\N	MASUK	cmc46ubh400ketwlkkfu8nopc	cmck401eu0012twsds1qwqjw4	2025-07-12 00:01:07.454	2025-07-12 00:01:07.454
cmczhd70q01tptwsd2gi0yoha	2025-07-12	2025-07-12 00:01:23.388	\N	MASUK	cmc46trp000ihtwlkk9doz5ah	cmca53cvo00o5twlke9erzxzp	2025-07-12 00:01:23.402	2025-07-12 00:01:23.402
cmczhnw6c01trtwsdjsq776zw	2025-07-12	2025-07-12 00:09:42.559	\N	MASUK	cmc46uzp400mttwlk0oazh0s3	cmck401eu0012twsds1qwqjw4	2025-07-12 00:09:42.564	2025-07-12 00:09:42.564
cmczwgdv201tvtwsdqyfbv3m0	2025-07-12	\N	2025-07-12 07:03:46.476	PULANG	cmc46pa83001dtwlkw34o2zus	cmck461f1002atwsd7hvt6jif	2025-07-12 07:03:46.479	2025-07-12 07:03:46.479
cmczwlicd01txtwsd70idh7rd	2025-07-12	\N	2025-07-12 07:07:45.56	PULANG	cmc46t5kl00g8twlkurga8kks	cmck0vrtn000gtwsdjzf0zz94	2025-07-12 07:07:45.565	2025-07-12 07:07:45.565
cmd000e1d01tztwsd82pkz5r3	2025-07-12	\N	2025-07-12 08:43:18.668	PULANG	cmc46uzp400mttwlk0oazh0s3	cmck401eu0012twsds1qwqjw4	2025-07-12 08:43:18.673	2025-07-12 08:43:18.673
cmd00hwa001u3twsdyjjej05k	2025-07-12	\N	2025-07-12 08:56:55.454	PULANG	cmc46tiru00hktwlk85dmpfyh	cmck45utb0028twsd8uf3m0ef	2025-07-12 08:56:55.465	2025-07-12 08:56:55.465
\.


--
-- Data for Name: jurnal_comments; Type: TABLE DATA; Schema: public; Owner: jurnal_user
--

COPY public.jurnal_comments (id, comment, "jurnalId", "teacherId", "createdAt", "updatedAt") FROM stdin;
cmcljty8w004ttwsdd7asukrw	Mantaps juga kerjanya	cmcljkmdh004ptwsdklzs3ctd	cmbiwwm9i0004tw0fdfr46otb	2025-07-02 06:01:37.953	2025-07-02 06:01:37.953
cmcljuf2i004vtwsd4vl49v9z	Bukakan akses	cmclefpao003vtwsdf2vdr5kv	cmbiwwm9i0004tw0fdfr46otb	2025-07-02 06:01:59.755	2025-07-02 06:01:59.755
cmcms5e8x00cxtwsdulzo7lq0	mantap biar sehat	cmclq51fj007ftwsdw1514230	cmbiwwm9i0004tw0fdfr46otb	2025-07-03 02:42:15.01	2025-07-03 02:42:15.01
cmcmsdoyv00cztwsdq7nluhi4	dikasih banyak kerjaan nangis ntar	cmclqxbi5007jtwsdchaejd1n	cmbiwwm9i0004tw0fdfr46otb	2025-07-03 02:48:42.151	2025-07-03 02:48:42.151
cmcmsf7ll00d1twsd4a529o2m	mantap	cmclsd5rj007ptwsd1zwfosr7	cmbiwwm9i0004tw0fdfr46otb	2025-07-03 02:49:52.954	2025-07-03 02:49:52.954
cmcmsg2eu00d3twsd7fpdqbu1	ngerikkkk, mainya smaa ibu ibu pkk	cmcll2qa80057twsdpc4mstff	cmbiwwm9i0004tw0fdfr46otb	2025-07-03 02:50:32.886	2025-07-03 02:50:32.886
cmcmsid6d00d5twsdm6lgh9bz	ngerikkkk	cmcms0y0400cvtwsdznk2y6d8	cmbiwwm9i0004tw0fdfr46otb	2025-07-03 02:52:20.149	2025-07-03 02:52:20.149
cmcmsiogh00d7twsdad3l6v5l	ngerikkk	cmcms0c1n00cttwsdzvkyjuoi	cmbiwwm9i0004tw0fdfr46otb	2025-07-03 02:52:34.77	2025-07-03 02:52:34.77
cmcmsjy0k00d9twsdxcktj77k	jadi mana video room tour nya?	cmclwpc560085twsdck72mgld	cmbiwwm9i0004tw0fdfr46otb	2025-07-03 02:53:33.813	2025-07-03 02:53:33.813
cmcmskunc00dbtwsd57o3y3rn	siapa yang mau nikah?	cmck25a07000ltwsdxjqflny2	cmbiwwm9i0004tw0fdfr46otb	2025-07-03 02:54:16.104	2025-07-03 02:54:16.104
\.


--
-- Data for Name: jurnals; Type: TABLE DATA; Schema: public; Owner: jurnal_user
--

COPY public.jurnals (id, tanggal, kegiatan, dokumentasi, "studentId", "createdAt", "updatedAt") FROM stdin;
cmcd9m48z00p2twlk5uwydohg	2025-06-26	Hari ini tidak banyak yang di kerjakan hanya membantu mengstampel beberapa berkas\ndan kemudian melanjutkan mengisi rekapitulasi data. \nMohon maaf tadi tidak sempat absen pulang di karenakan lupa, nanti dan seterusnya di usahakan tidak mengulangi lagi 🙏🏻		cmc46pctz001ptwlko6va5kot	2025-06-26 10:53:26.916	2025-06-26 10:53:26.916
cmbiwwmb4000ntw0fd6410pt7	2025-06-05	Membuat makanan jurnal		cmbiwwmam000ftw0f0u11ve8o	2025-06-05 05:04:36.592	2025-06-05 21:39:32.82
cmbkdxp730001tw50443nqm83	2025-06-06	makan makan aja hari ini		cmbiwwmam000ftw0f0u11ve8o	2025-06-06 05:49:06.639	2025-06-06 05:50:15.533
cmbpxdciz0003tws2kx4qf1m3	2025-06-10	Membuat makanan pokok		cmbiwwmam000ftw0f0u11ve8o	2025-06-10 02:52:00.294	2025-06-10 02:52:00.294
cmcboq70n00omtwlkksk00zbe	2025-06-25	" membuka silinder head "\n" Pengecekan oli pada mobil "\n" Mengecek mobil menggunakan alat scanner. No fault codes stored/tidak ada kode kesalahan yang di simpan "\n" Di lanjutkan dengan melepas silinder head karna beit taiming putus, penghubung krensap ke camsap " \n" Menyekur Valve silinder head agar tidak bocor " 	Kegiatan hri ini tanggal 25 Juni 2025	cmc46trp000ihtwlkk9doz5ah	2025-06-25 08:20:59.016	2025-06-25 08:46:44.613
cmcbrwixv00ostwlko9cwit8p	2025-06-25	Hari ini,hari ke 2  aku dateng ke kantor desa sekitar jam 7  pagi, terus duduk sebentar sambil nungguin mbak² staf nya pada Dateng, setelah itu langsung mulai aktivitas PKL. Tugas utamaku hari ini adalah bantu rekap data SPT PBB tahun 2024. Jadi aku ngecek nama-nama wajib pajak dan nyocokin sama NOP serta jumlah pajaknya.\n\nKerjaannya lumayan bikin fokus karena harus teliti dan gak boleh asal. Tapi aku ngerasa enjoy juga karena sistem kerjanya udah dijelasin, jadi aku gak bingung. Kadang aku tanya ke staf kalau ada data yang kelihatannya kurang jelas, dan mereka juga bantuin ngejelasin dengan sabar.\n\nSiang nya , aku diminta buat bikin format tabel pendataan pengangguran. Aku cuma nyusun kolom-kolomnya aja kayak nama, tanggal lahir, P/L, pendidikan, dan alamat lengkap dan kelurahan/desa, kecamatan,Nomor handphone.Gak ngisi datanya, karena itu bagian staf yang ngerjain.\n\nHari ini cukup produktif. Walaupun gak banyak gerak, tapi lumayan karena bisa ngerjain tugas dari awal sampai akhir dengan teliti.		cmc46pi7s002htwlk9tebi51u	2025-06-25 09:49:53.251	2025-06-25 09:49:53.251
cmcbxa0n100outwlkyshg4egu	2025-06-25	Hari ini saya membantu mengisi rekapitulasi data masyarakat dan membuat lampiran surat.		cmc46pctz001ptwlko6va5kot	2025-06-25 12:20:20.768	2025-06-25 12:20:20.768
cmcivkel20009twsryao1nklx	2025-06-30	melayani BPHTB (Bea Perolehan Hak atas Tanah dan Bangunan) 		cmc46rwds00bstwlkvna2msl2	2025-06-30 09:06:49.392	2025-06-30 09:06:49.392
cmcivt03m000btwsr7dd92j0c	2025-06-30	Hari ini aku mulai kegiatan dengan bantu nyusun berkas-berkas yang masih berantakan di meja. Aku pilah dulu sesuai jenisnya, terus dimasukin ke map satu-satu.\n\nSetelah itu, aku juga bantu Scan beberapa dokumen. Aku scan satu-satu, cek hasilnya di komputer, terus langsung aku print. Kadang ada dokumen yang harus bolak-balik atau dicek lagi sebelum diprint, jadi aku kerjainnya pelan-pelan biar hasilnya rapi. Hari ini lumayan produktif, dan aku juga jadi makin paham cara kerja alat scan sama printer di kantor.	1. https://drive.google.com/file/d/1ICU6QLFPwHEhseswKkDiolf6PnqqQanG/view?usp=drivesdk\n2. https://drive.google.com/file/d/1I7vHHrt_sAdCwviiA-Dd-mL9k0TTfUM4/view?usp=drivesdk	cmc46pi7s002htwlk9tebi51u	2025-06-30 09:13:30.562	2025-06-30 09:13:30.562
cmcd6jdc200p0twlkhlyk7jot	2025-06-26	Hari ini, hari ke 3 aku kantor desa gunung intan,kegiatan PKL GK terlalu sibuk tapi tetap seru. Setelah sampe di kantor desa, aku langsung dikasih tugas buat bantu ngecap berkas-berkas pakai stempel resmi desa.Jadi dokumen itu harus dikasih cap biar nunjukin kalau udah dicek dan selesai.\n\nAwalnya agak kaku pas pegang capnya, takut miring atau ketebelan tintanya, tapi lama-lama mulai terbiasa juga. Aku jadi ngerti pentingnya detail kecil kayak capan, karena itu nunjukin dokumen udah dicek dan resmi.\n\nSetelah itu, aku lanjutin kerjaan kemarin, yaitu rekap data SPT PBB tahun 2024. Masih seputar nyocokin data nama wajib pajak, NOP, dan jumlah pajaknya. Kadang ada data yang dobel atau kurang jelas, jadi aku catat buat ditanyain ke staf.\n\nHari ini rasanya lumayan capek dikit, karna kerjaannya duduk lama dan butuh fokus terus, tapi aku seneng karena bisa belajar hal baru dan makin terbiasa sama kerjaan kantor yang sebenarnya.\n\n*Bang maaf lupa absen🙏😞*		cmc46pi7s002htwlk9tebi51u	2025-06-26 09:27:19.867	2025-06-26 09:38:10.031
cmcj1j3bf000dtwsrr5zeaktj	2025-06-30	Hari senin ini seharusnya upacara bendera tapi karena hujan tidak di laksanakan hanya berfoto bersama untuk mengisi agenda pagi hari tadi. Kegiatan hari ini hanya memfotocopy berkas, memisahkan beberapa lembar berkas dan kemudian di staples dan juga perforator berkas untuk disimpan di dokumen. Selesai pada jam dua lebih kemudian tidak banyak yang kami lakukan, berisitirahat dan menunggu jam pulang.		cmc46pctz001ptwlko6va5kot	2025-06-30 11:53:45.867	2025-06-30 11:53:45.867
cmckdeyf5002ntwsdq5a50bct	2025-07-01	Kegiatan hari ini merekap data pengganguran bersama putri, kemudian saya membantu staff kantor memotong beberapa lembar kertas biru dengan ukuran A4, kemudian terakhir membuat dokumen lagi pada jam terakhir, sekian kegiatan hari ini.		cmc46pctz001ptwlko6va5kot	2025-07-01 10:14:14.465	2025-07-01 10:14:14.465
cmckfverz002ptwsd42oq8enh	2025-07-01	anfal koran,menginput berkas,membuat kwitansi dan kas kecil		cmc46sc4a00datwlklba5fy78	2025-07-01 11:23:01.391	2025-07-01 11:23:01.391
cmckfz2dw002rtwsd4idq0wu6	2025-07-01	membantu mengurus BPHTB, menulis berkas berkas untuk mengurus BPHTB 		cmc46rwds00bstwlkvna2msl2	2025-07-01 11:25:51.956	2025-07-01 11:25:51.956
cmcldrny8002ztwsdw6yrawcl	2025-07-02	Kerjain tugas membersihkan sepeda motor		cmbiwwmam000ftw0f0u11ve8o	2025-07-02 03:11:53.6	2025-07-02 03:11:53.6
cmcldrp6w0031twsdgcjl2npb	2025-07-02	Mencatat laporan berita acara \n		cmc46rixs00aitwlkpg86h565	2025-07-02 03:11:55.208	2025-07-02 03:11:55.208
cmcl6kpgn002xtwsdxi051rom	2025-07-01	kegiatan hari ini merekap data pengangguran bersama muti, dan kemudian kita di suruh bikin kop surat di jam terakhir,sekian\n\n( ini saya buat kemarin tanggal 1 ,tapi saya kirim hari ini tanggal 2 karna kemarin paket saya habis🙏🙏)		cmc46pi7s002htwlk9tebi51u	2025-07-01 23:50:31.656	2025-07-01 23:55:01.983
cmcldvnga0033twsdkbm505de	2025-07-02	Recap laporan data pengangguran desa babulu laut 		cmc46rpmn00b3twlk3kcu7mik	2025-07-02 03:14:59.578	2025-07-02 03:14:59.578
cmcldzc7d0035twsd9ogwoh97	2025-07-02	memilih dan menyusun berkas disposisi sesuai dengan bulan nya		cmc46p6jo000ttwlkjoqzjw5q	2025-07-02 03:17:51.625	2025-07-02 03:17:51.625
cmcldzx850037twsd6dumrco8	2025-07-02	Rapat dengar pendapat komisi III terkait Efisiensi anggaran dan anggaran tenaga harian lepas		cmc46pmrj0035twlkiohdnxpz	2025-07-02 03:18:18.87	2025-07-02 03:18:18.87
cmcle3vqc0039twsdhqidd9og	2025-07-01	menyalin jurnal dri buku ke komputer dan mencatat  jurnal surat yang telah di terima dari luar		cmc46p6jo000ttwlkjoqzjw5q	2025-07-02 03:21:23.557	2025-07-02 03:23:57
cmcle7eam003btwsdowrvymoo	2025-07-02	Mencatat laporan berita BPD		cmc46ru3200bhtwlkqx7b7u7h	2025-07-02 03:24:07.583	2025-07-02 03:24:07.583
cmcle9n7k003dtwsdc2hu5hb7	2025-07-01	membuat jurnal surat masuk dan keluar,dan juga menyalin tulisan yang sudah di catat di buku ke komputer 		cmc46pdme001utwlksga35tj7	2025-07-02 03:25:52.449	2025-07-02 03:25:52.449
cmcleazo1003ftwsdqgx2cu0c	2025-07-02	melakukan dan membantu menyusun nyusun berkas bulanan untuk di simpan		cmc46pdme001utwlksga35tj7	2025-07-02 03:26:55.249	2025-07-02 03:26:55.249
cmcledyc3003htwsd3ille1nm	2025-06-30	menyusun berkas"		cmc46qnhi007atwlkoshg5ob4	2025-07-02 03:29:13.492	2025-07-02 03:29:13.492
cmcledyh9003jtwsdsd5xpm36	2025-06-30	menyusun berkas"		cmc46r5k40091twlkc6d32ylm	2025-07-02 03:29:13.678	2025-07-02 03:29:13.678
cmcleeav5003ltwsdzkr34tsu	2025-07-02	Kerjain pengecekan slip penyetoran bank kaltimtara	https://drive.google.com/file/d/1nLuLEbwF_BrI5G741q9DDj8YYovXkNgR/view?usp=drivesdk	cmc46p6zu000wtwlk8cv819k1	2025-07-02 03:29:29.73	2025-07-02 03:29:29.73
cmcleeqzo003ntwsdnq0iqrx5	2025-07-02	menyatat dokumen yang belum di input		cmc46r5k40091twlkc6d32ylm	2025-07-02 03:29:50.628	2025-07-02 03:29:50.628
cmcleesn6003ptwsduoj4l3al	2025-07-01	menyatat dokumen yang belum di input		cmc46qnhi007atwlkoshg5ob4	2025-07-02 03:29:52.77	2025-07-02 03:29:52.77
cmclefb53003rtwsdx1sttlgm	2025-07-01	menyatat dokumen yang belum di input		cmc46r5k40091twlkc6d32ylm	2025-07-02 03:30:16.744	2025-07-02 03:30:16.744
cmclefbch003ttwsdxhs37uu2	2025-07-02	menyatat dokumen yang belum di input		cmc46qnhi007atwlkoshg5ob4	2025-07-02 03:30:17.01	2025-07-02 03:30:17.01
cmclefpao003vtwsdf2vdr5kv	2025-07-02	Membuat html+css+js sederhana	https://drive.google.com/drive/folders/1sKSIwvrEQAXarS1norWvGmmkPyXG6T9y?usp=drive_link	cmc46ptun0045twlkjz41wc1h	2025-07-02 03:30:35.088	2025-07-02 03:31:23.302
cmcletoid003ztwsdhj0i4eby	2025-06-30	pendaftaran pbb menggunakan pemetaan,pengecekan nama pajak dan mencetak \n		cmc46qc9w0067twlkcuynnxtk	2025-07-02 03:41:27.253	2025-07-02 03:41:27.253
cmcleu5nn0041twsdwudgbeb6	2025-07-01	pendaftaran pbb menggunakan pemetaan dan pengecekan nama pajak\n		cmc46qc9w0067twlkcuynnxtk	2025-07-02 03:41:49.475	2025-07-02 03:41:49.475
cmclezd6x0043twsd7gpv3kh3	2025-07-02	- menginput data masjid yang ada di kec. babulu\n- menginput data orang nikah di tahun 2024\n- nulis  pertanyaan" untuk org yg mau nikah	1. https://drive.google.com/file/d/1-1DdlYgV8KsaIdfccpLBa0jjDNPkzifL/view?usp=drivesdk\n2. https://drive.google.com/file/d/1--kzVCOPbbg-o-7mpbEa0rfLjSlooorw/view?usp=drivesdk	cmc46qeik006etwlk22jwlw57	2025-07-02 03:45:52.521	2025-07-02 03:45:52.521
cmclf1dsv0045twsdlssowy0h	2025-07-02	-meng input data masjid yang ada di kec. babulu\n-meng input data orang nikah ditahun 2024\n-nulis manual pertanyaan² orang yang mau nikah\n	https://drive.google.com/file/d/1weubEfc9_nmHpaw02xaY2frT0Svkvuip/view?usp=drivesdk	cmc46qufe007xtwlk6y6ld8k6	2025-07-02 03:47:26.589	2025-07-02 03:47:26.589
cmck25a07000ltwsdxjqflny2	2025-07-01	Melakukan kegiatan registrasi SKU (Surat Keterangan Usaha) dan SKUN ( Surat Keterangan Untuk Nikah).	https://drive.google.com/file/d/1-RMKSIBTQYClbsRAd7bx-wcxzo_wNt93/view?usp=drivesdk	cmc46ra3i009ktwlk4kxhy7zp	2025-07-01 04:58:47.143	2025-07-02 03:50:17.444
cmclf8o5s0047twsdhzrpblsg	2025-07-02	Belajar EPSON men-scan data menjadi satu kedalam pdf 		cmc46pp3s003htwlkl4no5tkd	2025-07-02 03:53:06.641	2025-07-02 03:53:06.641
cmclka1cv004ztwsdqwz0rw37	2025-07-02	hari ini saya membantu proses administrasi pencatatan data pernikahan di kantor desa. tugas saya yaitu menyalin informasi dari dokumen identitas calon pengantin (KTP dan KK) ke dalam buku register pernikahan. data yang dicatat meliputi nama, tempat dan tanggal lahir, alamat, nama wali, serta tanggal pelaksanaan akad nikah.\n\nsaya juga membantu menempelkan foto dan memastikan data yang ditulis sudah benar serta sesuai dengan dokumen yang diberikan warga.	https://drive.google.com/file/d/1pzIa5AnCmWAarQjPPSnzGWeQu5S4koE3/view?usp=drivesdk	cmc46pkez002ttwlknaeob0ip	2025-07-02 06:14:08.479	2025-07-09 07:51:04.708
cmclhvhgb004btwsd7sg7mj47	2025-07-02	Saya sedang memperbaiki kartu keluarga masyarakat 		cmc46pf530021twlkuuodzcss	2025-07-02 05:06:50.267	2025-07-02 05:06:50.267
cmcli3c64004dtwsdsm8vk85z	2025-07-02	Hari dimana kita di berikan tugas, dan tugas ini harus di selesai kan segera, dan kami diberikan tugas seperti materi html dan JavaScript, dan tugas kamu seperti membikin kan  kalkulator sederhana dan situs		cmc46q1y10055twlk6l4h720o	2025-07-02 05:12:56.668	2025-07-02 05:12:56.668
cmclig0a7004ftwsdd48u5djt	2025-07-02	Rapat dengar pendapat komisi III terkait Efisiensi anggaran dan anggaran tenaga harian lepas		cmc46pjq9002ptwlkdlsbonh2	2025-07-02 05:22:47.791	2025-07-02 05:22:47.791
cmclir03m004htwsddjfxfbhl	2025-07-01	Dsrh mengantarkan surat ke karyawan lain nya		cmc46pjq9002ptwlkdlsbonh2	2025-07-02 05:31:20.771	2025-07-02 05:31:20.771
cmclirxdb004jtwsdur3o7knd	2025-07-01	Nyalin data jurnal dari buku ke komputer dan mencatat data surat masuk dari luar		cmc46pmrj0035twlkiohdnxpz	2025-07-02 05:32:03.887	2025-07-02 05:32:03.887
cmcljkmdh004ptwsdklzs3ctd	2025-07-02	Di hari ini saya tidak terlalu berkegiatan, saya hanya mengantar berkas dan mengambil nya	Hari pertama PKL sedikit membosankan karena tidak memiliki banyak kegiatan, hanya duduk dan diam	cmc46prm8003ttwlkgahsy2jt	2025-07-02 05:54:22.661	2025-07-02 05:54:22.661
cmcljm1zi004rtwsdygfczdbw	2025-07-02	tugas hari ini adalah belajar html dasar dan membuat kalkulator sederhana menggunakan vs code 		cmc46putt0049twlkz0v03scf	2025-07-02 05:55:29.55	2025-07-02 05:55:29.55
cmclkonjb0053twsdmbh5zcjm	2025-07-02	1.mengscan dokumen penerima SPM\n2.belajar poto copy \n3.membantu menginput nomor kartometrik ke dalam raperbub tapal batas\n4.merangkap sppd pegawai		cmc46pxyb004ptwlk2lkmy29h	2025-07-02 06:25:30.407	2025-07-02 06:25:30.407
cmclkw4ga0055twsdickcpxzt	2025-07-02	hari ini saya menandain dokumen yang belum di tanda tangani,lalu menyusun data untuk bukti transaksi	https://drive.google.com/file/d/13-DxpW-e2x456XMqOzPgN0K1eiBSGmqN/view?usp=drivesdk	cmc46q9ut005xtwlkhtlk8doe	2025-07-02 06:31:18.922	2025-07-02 06:31:18.922
cmclkk4n10051twsdi4lqx65b	2025-07-02	hari ini saya penandatanganan berkas yang belum di tandatangani, lalu menyusun data untuk bukti transaksi.	https://drive.google.com/file/d/1Vnbn2wVHjXr81srivTOLTXxUtvrQSDTb/view?usp=drivesdk	cmc46rcbv009rtwlkrdwu5dht	2025-07-02 06:21:59.293	2025-07-02 06:31:53.963
cmcll2qa80057twsdpc4mstff	2025-07-02	Saya ikut membantu Bimbingan teknis (bimtek) \nPeningkatan kapasitas pengurus pkk dan lembaga desa sekecamatan babulu kabupaten penajam paser utara tahun 2025	https://drive.google.com/file/d/1GjOzPjlgJQF1fKXeJJUdWS_ZPr0nWCNK/view?usp=drivesdk	cmc46rgo400a5twlk8xzlphlx	2025-07-02 06:36:27.153	2025-07-02 06:38:47.828
cmcllkdp9005dtwsd8kmijuzx	2025-07-02	Kegiatan hari ini menandai berkas dengan sticky note, lalu membantu memfotocopy dokumen, mengstampel beberapa kertas undangan serta melipatnya.		cmc46pctz001ptwlko6va5kot	2025-07-02 06:50:10.653	2025-07-02 06:50:10.653
cmclli7ag005btwsd6hxn75dz	2025-07-02	kegiatan hari ini ,kita menandain berkas dengan sticky note,dan ngasih berkas² stempel,lalu membantu menfotocopi surat undangan dan melipat nya		cmc46pi7s002htwlk9tebi51u	2025-07-02 06:48:29.032	2025-07-02 06:50:11.746
cmcllls44005ftwsdq9xk8ern	2025-07-02	saya mengerjakan ddk untuk profil desa 	https://drive.google.com/file/d/1JGRBd8WPG8RdRPgHdf_Z6U0abtN6o47U/view?usp=drivesdk	cmc46px46004ltwlkbeei43ix	2025-07-02 06:51:15.988	2025-07-02 06:51:15.988
cmcllrdhr005htwsdto7r5stj	2025-07-02	Di hari ini saya membantu membersihkan dalam kantor seperti menyapu dan mencuci piring di dapur, selanjutnya membantu memindahkan data orang mau pindahan,dan menulis data di buku agenda surat keluar-masuk tahun 2025	https://drive.google.com/file/d/1F-9DZaOk-YwxCRkc7mKfaWVdNki0qSGx/view?usp=drivesdk	cmc46poab003dtwlkkkqtlmi4	2025-07-02 06:55:36.975	2025-07-02 06:55:36.975
cmclhczwq0049twsdntdh34cw	2025-07-02	Day 1 PKL :\nPembuatan kabel LAN 	https://drive.google.com/drive/folders/1-6Sua6unCx7OLWj5Oioyb8puA1Iiquu9 	cmc46p64g000qtwlkv3exmjxb	2025-07-02 04:52:27.722	2025-07-03 06:07:08.974
cmcllvxsj005jtwsdqr7p7pxs	2025-07-02	Saya di suruh bersih" ruang dan di suruh mencatat anggeda surat pertahanan 	https://drive.google.com/file/d/1BKvir4oWSx_6cZpc0wGcERL2IIu8xLiQ/view?usp=drivesdk	cmc46p7y00012twlkan1t901y	2025-07-02 06:59:09.907	2025-07-02 06:59:09.907
cmclm4lql005ltwsd5lmpcf0z	2025-07-02	Hari ini kegiatan saya ngisi data kartu keluarga		cmc46phg0002dtwlkt8tcx2ia	2025-07-02 07:05:54.19	2025-07-02 07:05:54.19
cmclm6mav005ntwsdhz3dqzlm	2025-07-02	Hari ini saya membantu membersihkan kantor desa seperti menyapu dan mengerjakan data di buku agenda surat keluar- masuk tahun 2025	https://drive.google.com/file/d/1Sgl7VpvUrdoNWWgT6p789kD4cfxZvO-p/view?usp=drivesdk	cmc46p5ql000ntwlkqrw64rf6	2025-07-02 07:07:28.231	2025-07-02 07:07:28.231
cmclzf4cl0089twsdclucoagm	2025-07-02	hari ini hanya perkenalan dengan orang orang kantor dan teman teman dari sekolah lain, tidak ada kegiatan dan tidak ada kerjaan.		cmc46s59s00cqtwlkc8385tg3	2025-07-02 13:17:59.877	2025-07-02 13:17:59.877
cmclmpqaf005rtwsdw9zdscsv	2025-07-02	Menyatat tanggal pada berkas" Dan menyalin berkas" Ke buku tulis besar		cmc46s31000cdtwlkt2zewnu5	2025-07-02 07:22:19.863	2025-07-02 07:22:47.795
cmclmqj5u005ttwsdmidw1ryc	2025-07-02	sampai nya saya di kandor desa jam 8 , setelah itu bantu bersih² kantor lanjut mindah kan data, orang nikah, pindah, dan acara² di babulu. 	https://drive.google.com/file/d/1-DAtkrRc5x2B6GUp4-tKfRuk1pjYrn50/view?usp=drivesdk	cmc46pwha004itwlkuzsyazgn	2025-07-02 07:22:57.282	2025-07-02 07:22:57.282
cmclleja40059twsd1qtyja2m	2025-07-02	Hari ini saya belum bekerja, masih berkenalan dengan orang-orang di bidang dikdas. Lalu room tour bersama teman teman pkl lainnya	https://drive.google.com/file/d/16_kSv2JQGoZwE03dpldUufo17tpqSF8k/view?usp=drivesdk	cmc46ryle00bztwlkx7awij04	2025-07-02 06:45:37.948	2025-07-02 07:28:39.329
cmclmf9dg005ptwsdwfln4zb5	2025-07-02	Mengetik proposal dan seken surat tanah	https://drive.google.com/file/d/1z4P4_OwSKV9k1vUd81dLkXGpcbG-tK8c/view?usp=drivesdk	cmc46qgrp006ltwlkgmd3zvcp	2025-07-02 07:14:11.38	2025-07-02 07:33:05.394
cmclneeaf005xtwsd1smahik3	2025-07-02	Kegiatan saya pada hari ini mencatat surat masuk, menyusun surat masuk di dalam map (GOBI), dan membuat dan mengeprint nama untuk di map nya.		cmc46q7m6005qtwlksgmx27n4	2025-07-02 07:41:30.711	2025-07-02 07:41:30.711
cmclneiwv005ztwsddobofmmv	2025-07-02	kegiatan saya pada hari ini yaitu mencatat surat masuk, menyusun surat ke dalam map, dan membuat dan mengeprint nama untuk di map.		cmc46qs78007qtwlkv76qqm1t	2025-07-02 07:41:36.704	2025-07-02 07:41:36.704
cmclodycs006ntwsdjqg5uajo	2025-07-02	pendaftaran pbb menggunakan pemetaan, pengecekan nama pajak,mencetak, mengisi surat permohonan objek pajak dan surat pemberitahuan objek pajak	https://drive.google.com/file/d/1kNBHQrfEAJkndKjMGxv5bzVlYd3XViFO/view?usp=drivesdk	cmc46qc9w0067twlkcuynnxtk	2025-07-02 08:09:09.676	2025-07-02 08:09:09.676
cmclp6yjq0077twsdbimtej4l	2025-07-02	Menginput data 		cmc46qpxp007jtwlkmf7x9mjw	2025-07-02 08:31:42.951	2025-07-02 08:31:42.951
cmclpaqeg007btwsdej5pf0zs	2025-07-02	menyusun berkas kgb dan pppk		cmc46siu100e0twlksoir3qyk	2025-07-02 08:34:39.016	2025-07-02 08:34:39.016
cmclpdx0g007dtwsd24obp1mv	2025-07-02	mencatat/menulis buku surat keluar TIM PENGGERAK PKK KEC. BABULU	https://drive.google.com/drive/folders/18Sm9-695rduHY4cFwaasCbOvYVvnLKwf	cmc46qlb20073twlkwsk9yxzh	2025-07-02 08:37:07.552	2025-07-02 08:37:07.552
cmclq51fj007ftwsdw1514230	2025-07-02	hari ini kegiatan saya cuma antar berkas dan ambil beras naik turun tangga		cmc46p4fv000etwlk7b55fk8g	2025-07-02 08:58:12.991	2025-07-02 08:58:12.991
cmclq5jkp007htwsdopxzz6af	2025-07-02	yang saya lakukan hari ini\n- mengetik dan merekap absensi bulanan\n- menyusun dan memperbaharui datang stok ATK ( Alat Tulis Kantor )	https://drive.google.com/file/d/1h6-Pz_Pb8HAdhBw7NSWR3zgv245SpN75/view?usp=drivesdk	cmc46qyuo008gtwlkpfrhsk5a	2025-07-02 08:58:36.505	2025-07-02 08:58:36.505
cmclqxbi5007jtwsdchaejd1n	2025-07-02	- hari ini cuman ngurus visum, tidak terlalu banyak pekerjaan selebihnya gabut gatau ngpn		cmc46rndz00awtwlkmxzfjiix	2025-07-02 09:20:12.414	2025-07-02 09:20:12.414
cmclrexzi007ntwsd6sdximmk	2025-07-02	hari ini saya mengetik SK panitia HUT RI ke-80 sekecamatan babulu	tidak ada dokumentasi	cmc46qwna0089twlkok4h7czv	2025-07-02 09:33:54.702	2025-07-02 09:33:54.702
cmclsd5rj007ptwsd1zwfosr7	2025-07-02	tadi saya di suruh bikin surat pengantar sama ngantar ke pos, dan saya mengarsipkan surat\n-saya juga di suruh sken dokumen sama fotocopy \n-dan saya di suruh minta tanda tangan sama ngimput kirim ke Bu Stela\n	https://photos.app.goo.gl/hziWi4fKBKu3kzXBA	cmc46rehr009ytwlk6ymfhb80	2025-07-02 10:00:31.088	2025-07-02 10:03:58.108
cmclsvdr4007rtwsdm9frdtpb	2025-07-02	••mengisi surat permohonan untuk objek pajak baru\n••mendaftar PBB melalui pemetaan\n••melayani BPHTB	https://drive.google.com/drive/folders/1Mf2_D9rCL3XC3gsFLvcsJmeAX4k5iqoz	cmc46rwds00bstwlkvna2msl2	2025-07-02 10:14:41.248	2025-07-02 10:14:41.248
cmclugwre007ttwsdnq46uwso	2025-07-02	-Membantu bang riswan cek CV join\n-membantu bang hasan cek coil BMW 		cmc46udog00kltwlk8mp3jpsw	2025-07-02 10:59:25.274	2025-07-02 10:59:25.274
cmcluhqb6007vtwsdklbxcfoy	2025-07-02	pengenalan diri \npengenalan lingkungan kantor \npengenalan para pegawai kantor \npembagian penempatan pkl\n		cmc46s0v200c6twlkxc2576re	2025-07-02 11:00:03.57	2025-07-02 11:00:03.57
cmclvc9e7007xtwsdubpel29c	2025-07-02	ganti aki \nngencangin panbel \nsama bantu ngambil kunci 		cmc46t12y00fptwlkqbiheqi2	2025-07-02 11:23:47.983	2025-07-02 11:23:47.983
cmclvf3bz007ztwsdxp6dvow6	2025-07-02	bantu pasang kipas radiator \nsama bantu ambil kunci\nsegitu dulu buat hari ini😁		cmc46tn5q00hytwlknc1ofewc	2025-07-02 11:26:00.095	2025-07-02 11:26:00.095
cmclvp3x40081twsdkb2wk85j	2025-07-02	-Bantu kak Riski tun up  \n- baikin pengereman rem depan \n- bantuin ganti CV joit\n-ganti oli 		cmc46uzp400mttwlk0oazh0s3	2025-07-02 11:33:47.416	2025-07-02 11:33:47.416
cmclvq6w00083twsd80tj2zce	2025-07-02	Memperbaiki cv joint, memperbaiki rem tromol belakang, tun up		cmc46ubh400ketwlkkfu8nopc	2025-07-02 11:34:37.921	2025-07-02 11:34:37.921
cmclwpc560085twsdck72mgld	2025-07-02	Pengenalan diri\nPengenalan lingkungan kantor\nPengenalan para pegawai kantor\nPembagian tempat ruangan pkl\nMenyusun berkas untuk persiapan sidang		cmc46rry000batwlkc67fga2c	2025-07-02 12:01:57.69	2025-07-02 12:01:57.69
cmclyn6qf0087twsdhwoe8pz3	2025-07-02	hari ini saya,membantu mekanik menjemper mobil truk		cmc46v8mu00nrtwlkm3c62zp1	2025-07-02 12:56:16.599	2025-07-02 12:56:16.599
cmclzxqym008btwsd9tjvwe3v	2025-07-02	hari ini saya hanya berkenalan dengan orang orang di kantor, berkeliling melihat sekitaran disdikpora bersama dengan teman teman pkl yang lain, dan mengantarkan beberapa surat ke bagian umum	https://drive.google.com/drive/folders/1ElihpgsucgKeKf_9-9zaK2r20RCrdEHg	cmc46s9u700d3twlkxxrzmirt	2025-07-02 13:32:28.99	2025-07-02 13:32:28.99
cmcmmi8zc009ntwsd6c5icp5e	2025-07-02	membantu stel falfe		cmc46tkyl00hrtwlkewcqik62	2025-07-03 00:04:17.016	2025-07-03 00:04:17.016
cmcmo29n300axtwsdjunto2m6	2025-07-03	pagi ini saya di suruh mengunting kertas formulir dengan rapi	https://drive.google.com/drive/folders/1PRp94GqQebqCho5hVYiigIp0ZWi10mAJ	cmc46qj48006wtwlkxjg53s62	2025-07-03 00:47:50.607	2025-07-03 00:47:50.607
cmcmozyzi00bjtwsdv9316br1	2025-07-03	hari ini saya membantu menggunting kertas	https://drive.google.com/drive/folders/1YMGrXyqO5LyVvz5MW2P1VBgl57GmolPv	cmc46r3af008utwlkutramzmy	2025-07-03 01:14:03.103	2025-07-03 01:14:03.103
cmcln91b2005vtwsdsjxntv9g	2025-07-02	kegiatan saya hari ini menscan dokumen penyebaran pohon dan mengarsipkan  \ndokumen pertahun		cmc46pq1s003ltwlkhuevqi62	2025-07-02 07:37:20.606	2025-07-03 05:24:41.209
cmclr5zdt007ltwsdpgeao5k0	2025-07-02	Melakukan registrasi Surat Keterangan dan melayani tamu\n	https://drive.google.com/file/d/1-jDHjD5FnTDQUNA1-HnT4arwYpuf39AR/view?usp=drivesdk	cmc46ra3i009ktwlk4kxhy7zp	2025-07-02 09:26:56.609	2025-07-03 05:45:49.619
cmcooon8b00n3twsd11dyujc0	2025-07-04	Memperbaiki rem tromol belakang, 		cmc46ubh400ketwlkkfu8nopc	2025-07-04 10:40:47.003	2025-07-04 10:40:47.003
cmcsz8cvb00vvtwsdzsxiep0x	2025-07-07	-ganti oli\n-ganti kampas rem belakang \n		cmc46uzp400mttwlk0oazh0s3	2025-07-07 10:47:07.559	2025-07-07 10:47:07.559
cmcmpra6t00c7twsdgj9t632i	2025-07-03	Sedang mengisi agenda mutasi kematian 	https://drive.google.com/file/d/1CfaWU-7w-lZ_5RuELbzD_X8zib-QWMee/view?usp=drivesdk	cmc46pf530021twlkuuodzcss	2025-07-03 01:35:17.333	2025-07-03 01:35:17.333
cmcmqb63l00cltwsdepebbom7	2025-07-03	saya melanjutkan tugas kemarin ddk untuk profil desa 	https://drive.google.com/file/d/1JJnQ-LxozaHN-XHwsUYBoBkh5vqREkYq/view?usp=drivesdk	cmc46px46004ltwlkbeei43ix	2025-07-03 01:50:45.153	2025-07-03 01:50:45.153
cmcmqzwcd00cntwsdxhog2j00	2025-07-03	mencatat dan memisahkan dokumen		cmc46qnhi007atwlkoshg5ob4	2025-07-03 02:09:58.909	2025-07-03 02:09:58.909
cmcmr1bh700cptwsdua63dcrq	2025-07-03	mencatat nomor skdp sesuai nama dan memisahkan berkas pajak sesuai nama PT 		cmc46r5k40091twlkc6d32ylm	2025-07-03 02:11:05.179	2025-07-03 02:11:05.179
cmcmr3pjp00crtwsdp08x5bf1	2025-07-03	Kegiatan saya hari ini isi data kartu keluarga		cmc46seaw00dhtwlknxsz3ms1	2025-07-03 02:12:56.726	2025-07-03 02:12:56.726
cmcms0c1n00cttwsdzvkyjuoi	2025-07-02	Mempelajari html dasar dan sedikit bahasa pemrograman java script 		cmc46psei003xtwlkve7bkjpy	2025-07-03 02:38:18.875	2025-07-03 02:38:18.875
cmcms0y0400cvtwsdznk2y6d8	2025-07-03	Membuat kalkulator sederhana dan tampilan web (CSS)		cmc46psei003xtwlkve7bkjpy	2025-07-03 02:38:47.333	2025-07-03 02:38:47.333
cmcmpdklm00bztwsdltlsp6y1	2025-07-03	mencatat surat masuk dan keluar sekretariat dn\nmengantar surat disposisi dari lantai 1 ke lantai 2		cmc46p6jo000ttwlkjoqzjw5q	2025-07-03 01:24:37.642	2025-07-03 02:44:25.923
cmcmtx0yz00ddtwsdxzf7asc0	2025-07-03	Membantu merapikan berkas”		cmc46pjq9002ptwlkdlsbonh2	2025-07-03 03:31:43.787	2025-07-03 03:31:43.787
cmcmvodmt00dftwsd4wurd3ca	2025-07-03	mengisi surat surat yang datang dan jga menyatat nya ke buku tulis sekretariat,dan juga mengantar berkas ke ketua dprd		cmc46pdme001utwlksga35tj7	2025-07-03 04:20:59.525	2025-07-03 04:20:59.525
cmcmw1i1n00dhtwsdrm6v7wht	2025-07-03	kegiatan saya hari ini, membantu membersihkan kantor,mencatat dan menerima transaksi penyetoran, menyusun laporan harian	https://drive.google.com/file/d/13VCqhEwbvOIgo5Rq3lzu4JG63Jwg8X3p/view?usp=drivesdk	cmc46q9ut005xtwlkhtlk8doe	2025-07-03 04:31:11.772	2025-07-03 04:31:11.772
cmcmy1v8000dltwsddqdolhwr	2025-07-03	Merapikan berkas”		cmc46pmrj0035twlkiohdnxpz	2025-07-03 05:27:28.08	2025-07-03 05:27:28.08
cmcn15h8x00dztwsd8pjgt9xr	2025-07-03	Bersih" ruangan dan membuat berita acara musyawarah desa(musdas) penyusunan penetapan program ketenangan pangan tahun anggaran 2025	https://drive.google.com/file/d/1BVO6juxXAZy09JffWSkWHu3ODmOOOmmD/view?usp=drivesdk	cmc46p7y00012twlkan1t901y	2025-07-03 06:54:15.442	2025-07-03 06:56:06.125
cmcn1oldf00e1twsd54epwkre	2025-07-03	Menyalin  berkas" Ke buku tulis besar 		cmc46s31000cdtwlkt2zewnu5	2025-07-03 07:09:07.251	2025-07-03 07:09:07.251
cmck2aup7000ntwsd2cqf8d80	2025-07-01	1. Melakukan pengarsipan SKUN (Surat Keterangan Untuk Nikah) dengan menata dan menyusun dokumen sesuai urutan dan data administrasi.\n2. Mengarsipkan SKU (Surat Keterangan Usaha) dengan rapi berdasarkan nama pemohon dan nomor surat.\n3. Membantu melayani tamu yang datang ke kantor desa, seperti mengarahkan tamu ke bagian yang dituju atau menyampaikan maksud kedatangan mereka kepada petugas terkait.	https://drive.google.com/drive/folders/1mqfbIfotLPN9GhhEkLjstL1fBuTD93jT	cmc46q5ev005jtwlkm0nl2m8g	2025-07-01 05:03:07.243	2025-07-05 00:36:45.378
cmcn1v4qo00e3twsd8kd70x9l	2025-07-03	Rekap laporan		cmc46ru3200bhtwlkqx7b7u7h	2025-07-03 07:14:12.288	2025-07-03 07:14:12.288
cmcmzaktk00drtwsdmp3hai8b	2025-07-03	Day 2 PKL :\ncara pemakaian tangga teleskopik	https://drive.google.com/drive/folders/1-6Sua6unCx7OLWj5Oioyb8puA1Iiquu9 	cmc46p64g000qtwlkv3exmjxb	2025-07-03 06:02:14.121	2025-07-03 06:11:46.089
cmcn047pq00dttwsd8le5uzuq	2025-07-03	Hari ini saya mengerjakan surat dispen nikah	https://drive.google.com/file/d/1HBSHdbkN6JETLB_jqWjfXyFjJAhohZrD/view?usp=drivesdk	cmc46rgo400a5twlk8xzlphlx	2025-07-03 06:25:16.815	2025-07-03 06:25:16.815
cmcn0etw200dvtwsdxcg0ql1u	2025-07-03	-bersih² gudang\n-meng input data masjid dan mushola\n	https://drive.google.com/file/d/1xVK_CN727JpW21G4McTpVU91iPpQyydP/view?usp=drivesdk	cmc46qufe007xtwlk6y6ld8k6	2025-07-03 06:33:32.114	2025-07-03 06:33:32.114
cmcn0g8dd00dxtwsdbau7lpn6	2025-07-03	- membersihkan gudang \n- meng input data masjid yang ada di kec babulu\n- mencatat data pasangan pengantin 	- https://drive.google.com/file/d/1-uo0KWEL-O7tSYOQscyNMop_EVxGCqPg/view?usp=drivesdk\n\n- https://drive.google.com/file/d/10--mjkrHRiFnwjkJyVdCRKkae61NHIJH/view?usp=drivesdk\n\n- https://drive.google.com/file/d/10-FPidmUzveuNDkuAglXGKt4s8qNC5yw/view?usp=drivesdk	cmc46qeik006etwlk22jwlw57	2025-07-03 06:34:37.538	2025-07-03 06:34:37.538
cmcn1y2fg00e5twsdwaqkjfk4	2025-07-03	Menyusun laporan yang sudah di foto copy	Day 2 sedikit membosankan karena kurang kegiatan 	cmc46rixs00aitwlkpg86h565	2025-07-03 07:16:29.261	2025-07-03 07:16:29.261
cmcn3afen00eltwsdbd324b1c	2025-07-03	- menempel struk spbu pada selembar kertas hvs\n- foto copy struk spbu dan berkas-berkas lain nya\n- mencatat arsip surat masuk		cmc46siu100e0twlksoir3qyk	2025-07-03 07:54:05.567	2025-07-03 07:54:05.567
cmcn20iau00e7twsd3j6xdi6s	2025-07-03	hari ini saya melakukan kerjaan scan pdf pada dokumen SPPD		cmc46q7m6005qtwlksgmx27n4	2025-07-03 07:18:23.143	2025-07-03 07:18:23.143
cmcn20m5c00e9twsd36o44fx4	2025-07-03	hari ini saya melakukan kerjaan scan pdf pada dokumen SPPD.		cmc46qs78007qtwlkv76qqm1t	2025-07-03 07:18:28.129	2025-07-03 07:18:28.129
cmcn2l60000eftwsdiajoi38u	2025-07-03	Kerjaan hari ini ga banyak cuman disuruh ngetik ngelanjut data rekap dan pasang galon,, lumayan membosan kan sebenarnya saya sudah minta tpi disini lagi ga ada kerjaan 		cmc46pp3s003htwlkl4no5tkd	2025-07-03 07:34:26.976	2025-07-03 07:34:26.976
cmcn2mjg600ehtwsdaypfakza	2025-07-03	di pagi hari membantu membersihkan dalam kantor menyapu,lalu melanjutkan mencatat data di buku agenda surat keluar masuk tahun 2025	https://drive.google.com/file/d/1CYY3vnmdf-rFlUoM5iZtbD7HeBZFXq-F/view?usp=drivesdk	cmc46poab003dtwlkkkqtlmi4	2025-07-03 07:35:31.063	2025-07-03 07:35:31.063
cmcn3kz5900f7twsddqtxvxkg	2025-07-03	membantu memasang kompresor 		cmc46tkyl00hrtwlkewcqik62	2025-07-03 08:02:17.709	2025-07-03 08:02:17.709
cmcn3mdrf00fbtwsdb0l851e7	2025-07-03	membuat surat permohonan dan membuat pdf	tidak bisa meng upload dokumentasi	cmc46qwna0089twlkok4h7czv	2025-07-03 08:03:23.307	2025-07-03 08:03:23.307
cmcn3o1y300fntwsdgouxtpjw	2025-07-03	Membuat surat permohonan dan Membuat pdf		cmc46qlb20073twlkwsk9yxzh	2025-07-03 08:04:41.307	2025-07-03 08:04:41.307
cmcn3k43w00eztwsdfd87qaid	2025-07-03	Menginput data aset tahun 2022 s/d 2024, belajar cara fotocpoy dan melayani tamu.\n\n	https://drive.google.com/file/d/10M9XLgY2La8A-PA-qKVNqx7cXBuheafs/view?usp=drivesdk	cmc46ra3i009ktwlk4kxhy7zp	2025-07-03 08:01:37.484	2025-07-03 22:27:14.328
cmcmza4bh00dptwsdlmtjk0wx	2025-07-03	– Mengantarkan surat ke bagian umum, kepada mba Yupita\n– Mengantarkan surat dan meminta tanda tangan, kepada ibu Suharti, pak Ismail\n– Memasukan dokumen ke buku arsip, di minta oleh ibu Jannah		cmc46ryle00bztwlkx7awij04	2025-07-03 06:01:52.733	2025-07-10 07:50:12.638
cmcn3ppe200fvtwsdimk0a9ve	2025-07-03	Kegiatan saya hari ini:\n1. membantu memasang matrai 10000 diperjanjian\n2. ⁠menyanyi bersama indonesia raya\n3. ⁠membantu meng rename txt akuntansi\n4. ⁠membuat sampul diword\n5. ⁠ngeprint surat peminjaman nasabah	lupa😅	cmc46p6zu000wtwlk8cv819k1	2025-07-03 08:05:58.347	2025-07-03 08:05:58.347
cmcn3rldb00g1twsd02g7on2j	2025-07-03	Tugas hari ini tidak banyak hanya ngeprint 	https://drive.google.com/file/d/1Rd1-jYxxCtgQ3YPjMLi685lSKdHRliWR/view?usp=drivesdk	cmc46qgrp006ltwlkgmd3zvcp	2025-07-03 08:07:26.447	2025-07-03 08:07:26.447
cmcn3vsmp00g5twsdzjzv9woo	2025-07-03	kegiatan yang saya lakukan hari ini\n-membuat kopi\n-merapikan berkas  - berkas\n- menyusun dan mengetik surat tugas bukti DD, surat perjalanan dinas ( SPPD )		cmc46qyuo008gtwlkpfrhsk5a	2025-07-03 08:10:42.453	2025-07-03 08:10:42.453
cmcn40fi900gbtwsdey5y5vax	2025-07-03	Hari ini kami mengerjakan tugas yang di berikan kemarin, tentang codingan pembuatan kalkulator sederhana dan mendisain dan menjadikan kalkulator nya jadi bagus dan rapi		cmc46q1y10055twlk6l4h720o	2025-07-03 08:14:18.753	2025-07-03 08:14:18.753
cmcn4pmbk00gdtwsdfirqdhiz	2025-07-03	Hari ini saya membantu membersihkan kantor seperti menyapu lalu mencatat data- data di buku agenda surat keluar- masuk tahun 2025	https://drive.google.com/file/d/1Sgl7VpvUrdoNWWgT6p789kD4cfxZvO-p/view?usp=drivesdk	cmc46p5ql000ntwlkqrw64rf6	2025-07-03 08:33:53.984	2025-07-03 08:33:53.984
cmcn50evw00gftwsdvqtu3yyz	2025-07-03	pemetaan PBB\ncetak bukti SPPT\nmenginput PBB	https://drive.google.com/drive/folders/1O4Z7iuwTi4MB7vCdCA4x21kKcS6R4TlY	cmc46rwds00bstwlkvna2msl2	2025-07-03 08:42:17.565	2025-07-03 08:42:17.565
cmcn559s300ghtwsdhnvrt9w0	2025-07-03	Beberes ruangan dan menginput data	https://drive.google.com/file/d/16xqRmO8QGqecC0fK3_8Cb60352HOBHLD/view?usp=drivesdk	cmc46qpxp007jtwlkmf7x9mjw	2025-07-03 08:46:04.228	2025-07-03 08:53:54.533
cmcn5lx6n00gttwsdjggr4ama	2025-07-03	kegiatan saya hari ini\n1.mengarisipkan dokumen pertahun\n2.pemusnahan dokumen yang tak terpakai		cmc46pq1s003ltwlkhuevqi62	2025-07-03 08:59:01.056	2025-07-03 08:59:01.056
cmcn6g51r00gvtwsdkoepgckn	2025-07-03	penginputan pbb, pendaftaran pbb menggunakan bhumi dan mencetak	https://drive.google.com/drive/folders/1k856vr01nCHXRF3qJvgEmTMGnl2upH7n	cmc46qc9w0067twlkcuynnxtk	2025-07-03 09:22:30.927	2025-07-03 09:22:30.927
cmcn6krmu00gxtwsdsg9yugz5	2025-07-03	Hari ini saya ngarsip berkas sama seperti sebelumnya,menginput data dan tadi saya di ajarkan untuk membuat invoice		cmc46sc4a00datwlklba5fy78	2025-07-03 09:26:06.822	2025-07-03 09:26:06.822
cmcn71jk700gztwsdwsae7lfy	2025-07-03	di hari ini saya memperbaiki daftar SOP dan ngeprint daftar SOP nya dan menghantar dokumen \n-meminta tanda tangan hakim dan pak sekertaris \n-men stampel berkas"\n-meminta tanda tangan dan meng sken dokumen	https://photos.app.goo.gl/U66rjSvjpdZD39iUA	cmc46rehr009ytwlk6ymfhb80	2025-07-03 09:39:09.511	2025-07-03 09:40:19.059
cmcn7dj6k00h1twsdxyk2br74	2025-07-03	Kegiatan hari ini saya mengikuti rapat permusyawarahan dusun, lalu membantu memprint dokumen.		cmc46pctz001ptwlko6va5kot	2025-07-03 09:48:28.893	2025-07-03 09:48:28.893
cmcn8scw300h3twsdxrj0uhu0	2025-07-03	-servis rem depan\n-ganti oli mesin sama transmisi \n-ganti disk brake \n-ganti master silinder 		cmc46uzp400mttwlk0oazh0s3	2025-07-03 10:28:00.166	2025-07-03 10:28:00.166
cmcna4vue00h5twsdmwgkn8hs	2025-07-03	Bongkar power stering\nBuka ban truk\nSekir klep		cmc46udog00kltwlk8mp3jpsw	2025-07-03 11:05:44.246	2025-07-03 11:05:44.246
cmcna8qc300h7twsdt7fi5w2g	2025-07-03	Mengganti disk break, mengganti rem cakram, ganti oli, ganti oli transmisi, tun up		cmc46ubh400ketwlkkfu8nopc	2025-07-03 11:08:43.731	2025-07-03 11:08:43.731
cmcnahop200h9twsd5o1fduoa	2025-07-03	hari ini saya skir klep dan,membantu mekanik membaguskan sil rem,dann power stering		cmc46v8mu00nrtwlkm3c62zp1	2025-07-03 11:15:41.51	2025-07-03 11:17:51.428
cmcnavn3y00hbtwsdfkjbf9eo	2025-07-03	melepas ban depan mobil trak \nmemasang stering mobil jep \nmemasang piston rem depan mobil trak \nmengecek minyak rem mobil trak 	..	cmc46t12y00fptwlkqbiheqi2	2025-07-03 11:26:32.639	2025-07-03 11:26:32.639
cmcnavn9300hdtwsd7el56wp1	2025-07-03	mensecrup klep dan tunap mobil bmw\ndan dongkrang mobil jab dan membersihkan mobil merce 		cmc46tn5q00hytwlknc1ofewc	2025-07-03 11:26:32.823	2025-07-03 11:26:32.823
cmcnb3ain00hftwsdrx54tfg8	2025-07-03	Foto copy berkas \nScan berkas\nMenyusun berkas\n		cmc46rry000batwlkc67fga2c	2025-07-03 11:32:29.567	2025-07-03 11:32:29.567
cmcnb55xq00hhtwsdqim9p2a7	2025-07-03	hari ini saya mendapatkan pengalam dan sensasi baru, sore sehabis ashar kami mendapatkan arahan buat bantuin kaka ilham masang wifi di sebakung 1 		cmc46pa83001dtwlkw34o2zus	2025-07-03 11:33:56.943	2025-07-03 11:33:56.943
cmco2gzm200ixtwsd8ce3f4ym	2025-07-04	Melaksanakan kegiatan senam pagi didepan kantor bupati bersama anggota DPRD		cmc46pmrj0035twlkiohdnxpz	2025-07-04 00:18:58.251	2025-07-04 00:18:58.251
cmcmw2ncn00djtwsdzr6hky5p	2025-07-03	Kegiatan saya hari ini Mengambil transaksi penyetoran uang dan mencatat bukti transaksi, serta  menyusun laporan harian.	https://drive.google.com/file/d/1W0h-RkaK-xsmPZIg2xejuYyzGGEAFe1C/view?usp=drivesdk	cmc46rcbv009rtwlkrdwu5dht	2025-07-03 04:32:05.269	2025-07-03 13:13:27.424
cmcnerce300hltwsdx9rms13l	2025-07-03	menyusun undangan perkara 	https://photos.app.goo.gl/wZveRq6rmAGT5sEe9	cmc46s0v200c6twlkxc2576re	2025-07-03 13:15:10.587	2025-07-03 13:15:10.587
cmco2h5a600iztwsdo434456q	2025-07-04	melaksanakan kegiatan senam pagi bersama anggota dprd di depan bupati		cmc46pdme001utwlksga35tj7	2025-07-04 00:19:05.598	2025-07-04 00:19:05.598
cmco2jaqq00j1twsd74hil5kh	2025-07-04	Melaksanakan kegiatan senam pagi di dpn kantor bupati bersama anggota dprd		cmc46pjq9002ptwlkdlsbonh2	2025-07-04 00:20:45.986	2025-07-04 00:20:45.986
cmco5sxri00jptwsdtzdqtr5r	2025-07-04	hari ini saya melanjutkan tugas kemaren namun hari ini ttg yg belum memiliki akte kelahiran	https://drive.google.com/drive/folders/1PRp94GqQebqCho5hVYiigIp0ZWi10mAJ	cmc46qj48006wtwlkxjg53s62	2025-07-04 01:52:14.575	2025-07-04 01:52:14.575
cmco5zgdl00jrtwsdg3qzyh39	2025-07-04	harini kegiatan saya cuma di antar ke tempat PKL sama pembimbing saya, dan mulai berkerja hari senin		cmc46uopi00lutwlk6ky20hrv	2025-07-04 01:57:18.633	2025-07-04 01:57:18.633
cmco7mw0c00jvtwsd6prpavpr	2025-07-04	kegiatan hari ini santai dan hanya kedatangan tamu yang ingin mengajukan pinjaman 	https://drive.google.com/file/d/13jkOcYTPpOdmc1wwN3Z6xceGwjkVBbJ1/view?usp=drivesdk	cmc46q9ut005xtwlkhtlk8doe	2025-07-04 02:43:31.596	2025-07-04 02:48:24.558
cmco7mtsd00jttwsdd3fe9fhs	2025-07-04	kegiatan hari ini relax, hanya menerima tamu yang ingin mengajukan pinjaman 	https://drive.google.com/file/d/1WI4YP2pPuzGExlIwJuQD-B6D1-TJFz4H/view?usp=drivesdk	cmc46rcbv009rtwlkrdwu5dht	2025-07-04 02:43:28.717	2025-07-04 02:47:41.698
cmco2gw1h00ivtwsdu5isxk3x	2025-07-04	Melaksanakan kegiatan senam pagi di depan kantor BUPATI bersama anggota DPRD dn kembali ke kantor mengerjakan surat disposisi serta mengantarkan nya		cmc46p6jo000ttwlkjoqzjw5q	2025-07-04 00:18:53.622	2025-07-04 03:46:50.868
cmcoejgap00jxtwsdgwrzzgda	2025-07-04	saya mencetak sppt,pendaftaran menggunakan bhumi	https://drive.google.com/file/d/1kNBHQrfEAJkndKjMGxv5bzVlYd3XViFO/view?usp=drivesdk	cmc46qc9w0067twlkcuynnxtk	2025-07-04 05:56:48.577	2025-07-04 05:56:48.577
cmcoeykcs00jztwsdsrmxn89o	2025-07-04	Sedang mengerjakan ddk profil desa 	https://drive.google.com/file/d/1DEwZsCOHJcDGl_DQFY1I03YPxfNpuiV4/view?usp=drivesdk	cmc46pf530021twlkuuodzcss	2025-07-04 06:08:33.676	2025-07-04 06:08:33.676
cmcof0c8w00k1twsdef7t1vap	2025-07-04	Bikin laporan	https://drive.google.com/file/d/1EPugAluBkVLk-nrTOwgtiX2wsmqdovJK/view?usp=drivesdk	cmc46rpmn00b3twlk3kcu7mik	2025-07-04 06:09:56.48	2025-07-04 06:09:56.48
cmcof0rka00k3twsde0741wah	2025-07-04	harii ini saya mengikuti senam pagii, setelah itu bersih' ruangan, selesai itu melanjutkan tugas ddk untuk profil desa 	https://drive.google.com/file/d/1LrHtKwTZqwUxupzkXhvrNNaxN6Yh7DSp/view?usp=drivesdk	cmc46px46004ltwlkbeei43ix	2025-07-04 06:10:16.331	2025-07-04 06:10:16.331
cmcoffidr00k5twsdvu2a8ykg	2025-07-04	- bebersih kantor\n- bakar bakar bersama\n\n\n		cmc46qeik006etwlk22jwlw57	2025-07-04 06:21:44.271	2025-07-04 06:21:44.271
cmcofjkn200k7twsdmedbu0hj	2025-07-04	Menginput data dari kertas ke laptop \nData" Pengangguran desa Labangka barat		cmc46s31000cdtwlkt2zewnu5	2025-07-04 06:24:53.822	2025-07-04 06:24:53.822
cmcog1c8n00k9twsdzzadf0g7	2025-07-04	- bersih²\n- bakar² ikan dari pak muslihudin	https://drive.google.com/file/d/1ypza1AXyyik1dYHaZ4srFvPumfns1tEs/view?usp=drivesdk	cmc46qufe007xtwlk6y6ld8k6	2025-07-04 06:38:42.744	2025-07-04 06:38:42.744
cmcog5out00kbtwsdz16uaycf	2025-07-04	tidak ada berkegiatan hari ini		cmc46qwna0089twlkok4h7czv	2025-07-04 06:42:05.717	2025-07-04 06:42:05.717
cmcog8flv00kdtwsd74hh56tb	2025-07-04	Membantu menyusun buku posyandu dan membagikan kartu antrian posyandu.\nNgeprent kertas BPD 	Hari ke 3 Sangat menyenangkan karena membantu remaja dan balita 	cmc46rixs00aitwlkpg86h565	2025-07-04 06:44:13.699	2025-07-04 06:44:13.699
cmcog8fq200kftwsdg7jr7jng	2025-07-04	hari ini kegiatan saya memindah jumlah anggaran yang ada di SPJ fungsional(pdf) ke RFK TW II di Excel 		cmc46q7m6005qtwlksgmx27n4	2025-07-04 06:44:13.851	2025-07-04 06:44:13.851
cmcogbaui00khtwsdplii6400	2025-07-04	hari ini kegiatan saya memindah jumlah anggaran yang ada di SPJ fungsional(pdf) dan mengisi ke RFK TW II di Excel		cmc46qs78007qtwlkv76qqm1t	2025-07-04 06:46:27.498	2025-07-04 06:46:27.498
cmcogbjpx00kjtwsdx2mdzwao	2025-07-04	Hari ini saya mengisi data bulan Juni tentang data perizinan dan paginya saya senam pagi di aula depan kantor bupati lumayan banyak waktu luang		cmc46pp3s003htwlkl4no5tkd	2025-07-04 06:46:38.997	2025-07-04 06:46:38.997
cmcogfs4d00kltwsd1gzoel3l	2025-07-04	Tidak ada kerjaan		cmc46rgo400a5twlk8xzlphlx	2025-07-04 06:49:56.509	2025-07-04 06:49:56.509
cmcogj6xp00kttwsdq0le3rlc	2025-07-04	Cek kesehatan tadi pagi, selebihnya tidak ada.		cmc46pctz001ptwlko6va5kot	2025-07-04 06:52:35.677	2025-07-04 06:52:35.677
cmcogkwq500kztwsd4ya6ay76	2025-07-04	hari ini kegiatan nya pemeriksaan kesehatan,di timbang,di ukur, habis tu gak ngapa ngapain		cmc46pi7s002htwlk9tebi51u	2025-07-04 06:53:55.757	2025-07-04 06:53:55.757
cmcoglp6z00l3twsdu2hu5g0l	2025-07-04	Kegiatan yang saya lakukan hari ini \n- festival tari ronggeng \n- pencatatan dan disposisi surat masuk	https://drive.google.com/file/d/1iUIYlpVt5a0qDBtlL4MfEIHLgLI6U487/view?usp=drivesdk	cmc46qyuo008gtwlkpfrhsk5a	2025-07-04 06:54:32.652	2025-07-04 06:54:32.652
cmcogm2vt00l5twsdo88zij9m	2025-07-04	Kegiatan hari ini, kegiatan membantu posyandu lansia dan balita, 	https://drive.google.com/file/d/1mXmorWbB0WOs9nw_rgYqXeLy189XfE0p/view?usp=drivesdk	cmc46ped8001ytwlkfrb06txj	2025-07-04 06:54:50.393	2025-07-04 06:54:50.393
cmcoltcke00mvtwsd58x8zqyo	2025-07-04	di hari ini tidak terlalu banyak kegiatan saya hanya melakukan bersih" di halaman belakang \n-kemudian kami di kumpulkan untuk makan rame"\ndan kami mengikuti apel sore	https://photos.app.goo.gl/emExTELVnwvzrHHy7	cmc46s0v200c6twlkxc2576re	2025-07-04 09:20:27.614	2025-07-04 09:22:29.487
cmclk9y0m004xtwsdftph5nkp	2025-07-02	kegiatan saya hari ini hanya membantu memotret berkas menjadi PDF, dan menulis data orang nikah. 	https://drive.google.com/file/d/1ZcuYhP1VQXC5WC8XfD4Ix2MacgV1pINo/view?usp=drivesdk	cmc46ped8001ytwlkfrb06txj	2025-07-02 06:14:04.151	2025-07-04 06:58:30.295
cmcogrbo000l9twsdalr49hgx	2025-07-04	Tidak ada kegiatan untuk hari ini	-	cmc46qgrp006ltwlkgmd3zvcp	2025-07-04 06:58:55.056	2025-07-04 06:58:55.056
cmcogu0vp00lbtwsd2rwab6k3	2025-07-04	Hari saya tetap mengerjakan yang kemarin, dan memahami struktur dan tepat dari coding nya, dan apa saja kegunaannya, 		cmc46q1y10055twlk6l4h720o	2025-07-04 07:01:01.015	2025-07-04 07:01:01.015
cmcogvge500ldtwsdk2mmpaeg	2025-07-04	- menyusun berkas permohonan pengunduran diri sebagai thl\n- foto copy berkas²		cmc46siu100e0twlksoir3qyk	2025-07-04 07:02:07.805	2025-07-04 07:02:07.805
cmcoh6kjv00lhtwsd825wf6bn	2025-07-04	hari ini tidak ada kegiatan 		cmc46qlb20073twlkwsk9yxzh	2025-07-04 07:10:46.411	2025-07-04 07:10:46.411
cmcohkl2000ljtwsdjol6vzmz	2025-07-04	Day 3 PKL :\nHari ini ikut serta dalam pemasaran wifi bertipe kabel 	https://drive.google.com/drive/folders/1-6Sua6unCx7OLWj5Oioyb8puA1Iiquu9	cmc46p64g000qtwlkv3exmjxb	2025-07-04 07:21:40.248	2025-07-04 07:21:40.248
cmcoi93iz00lltwsdb98us9os	2025-07-04	Hari ini saya melakukan kegiatan senam dan melanjutkan mencatat data data di buku agenda keluar masuk tahun 2025.dan sore nya saya mengikuti rapat	https://drive.google.com/file/d/1U243i6QtCbOPejyONb15AxrkyGADi7d3/view?usp=drivesdk	cmc46p5ql000ntwlkqrw64rf6	2025-07-04 07:40:43.931	2025-07-04 07:40:43.931
cmcoic5yt00lntwsdm19h7x9i	2025-07-04	kegiatan hari ini di awali dengan senam pagi,dan melanjutkan menulis data agenda keluar masuk 2025	https://drive.google.com/file/d/1DLPsyDqks9BUn97q1KzZjJh-IueN9TDY/view?usp=drivesdk\n\nhttps://drive.google.com/file/d/1CmXfGjWI5g7kYESkrI9AOjYhs4nwBMa5/view?usp=drivesdk	cmc46poab003dtwlkkkqtlmi4	2025-07-04 07:43:07.061	2025-07-04 07:43:07.061
cmcokso6600mptwsd4451vmig	2025-07-04	di pagi hari di mulai dengan senam stelah itu  lanjut ke ruang pelayanan di situ menyalin berkas² , setelah itu istrahat ssesudah istrahat di lanjutkan miting dan selesai. 	https://drive.google.com/file/d/10PT_1AppDlcCJrH9rcQrtGD6BktyVviV/view?usp=drivesdk	cmc46pwha004itwlkuzsyazgn	2025-07-04 08:51:56.383	2025-07-04 08:51:56.383
cmcokysn600mrtwsd8ulrcctg	2025-07-04	Membersihkan lingkungan kantor\nMelaksanakan apel sore\nMenyusun berkas ke dalam arsip hukum	https://drive.google.com/file/d/1-Rzhuv8jMXPsUOj-PxfRq-5hSA-fl098/view?usp=drivesdk	cmc46rry000batwlkc67fga2c	2025-07-04 08:56:42.114	2025-07-04 09:25:57.547
cmcol80uk00mttwsdkzh7lt8v	2025-07-04	di hari ini tidak terlalu banyak kegiatan saya hanya melakukan bersih" di halaman belakang \n-kemudian kami di kumpulkan untuk makan rame"\n-kemudian saya di suruh bungkus kado\ndan sore hari nya\n-saya membuat surat pos dan ngeprint\n-mencatat SOP\n-mengikuti apel sore hari	https://photos.app.goo.gl/K37gjk9YuicJwB3z9	cmc46rehr009ytwlk6ymfhb80	2025-07-04 09:03:52.652	2025-07-04 09:34:49.967
cmcomjqd900mxtwsdt84dtphk	2025-07-04	Kegiatan saya hari ini:\n1.membuat formulir nasabah \n2. menempelkan matrai disurat" perjanjian\n3. mengecek laporan teller\n4. ngeprint formulir\n5. mengisi data" nasabah	lupa difoto *malu juga	cmc46p6zu000wtwlk8cv819k1	2025-07-04 09:40:58.557	2025-07-04 09:40:58.557
cmcoo1j5900mztwsdqu47tx0o	2025-07-04	Mengikuti potong royong dan melaksanakan miting bersama anggota kantor desa 	https://drive.google.com/file/d/1BjGidgjqiVjI_HhsXyK4S4oEnxVrvYNR/view?usp=drivesdk	cmc46p7y00012twlkan1t901y	2025-07-04 10:22:48.593	2025-07-04 10:22:48.593
cmcoog0o400n1twsdxis5d0rj	2025-07-04	bang/ka, saya kemarin lupa isi jurnal jadi saya double kan.\n\n3/7/2025\n1.melayani membuat surat Dispen nikah 2.melayani membuat SKTM\n \n4/7/2025\n1.melayani membuat visum\n2.membantu mengantarkan surat paskas\n3.membantu buat makan gratis	https://drive.google.com/file/d/1-ZDrHOmtdioCcMfJyWbR2c2ZSQ4SFYRO/view?usp=drivesdk	cmc46rndz00awtwlkmxzfjiix	2025-07-04 10:34:04.516	2025-07-04 10:34:04.516
cmcoopnts00n5twsd03nxgg9x	2025-07-04	melayani tamu dan mengecek surat keputusan kepala desa	https://drive.google.com/file/d/10mgl1dXucRIa_JW4fHS1r46yWRsT7Frd/view?usp=drivesdk	cmc46ra3i009ktwlk4kxhy7zp	2025-07-04 10:41:34.433	2025-07-04 10:41:34.433
cmcooymqm00n7twsd1x8fs4ci	2025-07-04	bongkar porstering, bersihin blok mesin\nnyeting kampas rem Trak 		cmc46tn5q00hytwlknc1ofewc	2025-07-04 10:48:32.926	2025-07-04 10:48:32.926
cmcopi3w200n9twsd15j4tnps	2025-07-04	Stel rem truk\nBongkar pasang power stering		cmc46udog00kltwlk8mp3jpsw	2025-07-04 11:03:41.619	2025-07-04 11:03:41.619
cmcopiofp00nbtwsdpnkm25e3	2025-07-04	-ganti oli\n-servis rem depan belakang 		cmc46uzp400mttwlk0oazh0s3	2025-07-04 11:04:08.245	2025-07-04 11:04:08.245
cmcopioxo00ndtwsdrg7tdz0k	2025-07-04	setel rem trak\nbongkar pasang power steering \n		cmc46t12y00fptwlkqbiheqi2	2025-07-04 11:04:08.893	2025-07-04 11:04:08.893
cmcozyl7u00nftwsdw6rlzfhd	2025-07-03	saya membaca beberapa proposal yang masuk lalu saya disuruh untuk mencari inti dari proposal tersebut (misalnya dia membutuhkan dana, materi maupun material, dll. Saya juga mengantarkan surat kebeberapa bidang (PAUD, umum, pora, dll) 	https://drive.google.com/drive/folders/1ElihpgsucgKeKf_9-9zaK2r20RCrdEHg	cmc46s9u700d3twlkxxrzmirt	2025-07-04 15:56:26.731	2025-07-04 15:56:26.731
cmcp0001s00nhtwsd2qfr32n2	2025-07-04	dihari ini kegiatan saya hanya mengantarkan surat dan meminta tanda tangan ke pak kadis		cmc46s9u700d3twlkxxrzmirt	2025-07-04 15:57:32.608	2025-07-04 15:57:32.608
cmcmyw7uz00dntwsdmp22ctmu	2025-07-03	1. Membantu melayani tamu dan notaris yang datang ke kantor desa, termasuk menyambut, menanyakan keperluan, serta mengarahkan ke bagian atau petugas terkait.\n2. Menginput laporan data aset desa dari tahun 2022 hingga 2024 ke dalam sistem komputer sesuai dengan kategori dan jenis aset.\n3. Membantu memfotokopi berkas-berkas administrasi yang dibutuhkan untuk keperluan kantor dan pelayanan masyarakat.	https://drive.google.com/drive/folders/1n6AZnkzCAspV08NXkVmbEB4dXMML4SxM	cmc46q5ev005jtwlkm0nl2m8g	2025-07-03 05:51:04.139	2025-07-05 00:36:12.396
cmclemkvj003xtwsdyoomvwd1	2025-07-02	1. Mengarsipkan berbagai surat keterangan, seperti Surat Keterangan Domisili dan dokumen administrasi lainnya, dengan menata berkas sesuai jenis surat dan urutan data.\n2. Membantu mencatat laporan harian tukang yang berisi informasi tanggal, hari, dan cuaca untuk kebutuhan dokumentasi proyek desa.\n3. Membantu melayani tamu serta orang-orang yang datang untuk mempromosikan produk, seperti air minum mineral, dengan cara menyambut secara sopan, menanyakan keperluan, dan mengarahkan mereka ke petugas terkait.		cmc46q5ev005jtwlkm0nl2m8g	2025-07-02 03:35:55.951	2025-07-05 00:38:41.647
cmcpiihvk00njtwsdac39kreb	2025-07-04	1. Menyambut tamu serta pihak-pihak yang datang untuk mempromosikan produk, seperti mobil, skincare, body care, makeup, dan susu kambing, dengan bersikap ramah dan sopan, lalu mengarahkan mereka ke bagian yang sesuai.\n2. Melakukan pengarsipan surat keterangan, dengan menata dan menyusun dokumen berdasarkan jenis dan nama pemohon untuk mempermudah pencarian data.	https://drive.google.com/drive/folders/1nWiVAKwvDD0x-tuZBSWeTGAWtfoAP2Jg	cmc46q5ev005jtwlkm0nl2m8g	2025-07-05 00:35:48.591	2025-07-05 00:41:05.641
cmcpylkbn00nltwsdsganzxbz	2025-07-04	stempel dan megalisir surat, lalu ngantar surat ke ruangan sekertaris, dan mencatat data nama orang.		cmc46s59s00cqtwlkc8385tg3	2025-07-05 08:06:05.603	2025-07-05 08:06:05.603
cmcnbcbzk00hjtwsdcljbqert	2025-07-03	saya hari ini dapat di bidang penerima tamu, menurut saya bidang ini sangat tidak cocok untuk anak magang, dan kerjaan nya hanya menyuruh tamu mencatat kehadiran nya di buku...		cmc46s59s00cqtwlkc8385tg3	2025-07-03 11:39:31.376	2025-07-05 08:07:01.796
cmcpzl8ud00nntwsd635zt1bd	2025-07-04	Kami bakar ikan dan makan bersama, lalu membereskan setelah semuanya selesai seperti mencucui piring	https://drive.google.com/file/d/172jxLZdPHXpJCHZz_mMWGudB55UzQ7hV/view?usp=drivesdk	cmc46qpxp007jtwlkmf7x9mjw	2025-07-05 08:33:50.341	2025-07-05 08:33:50.341
cmcq1o62700nptwsd8fgu43r9	2025-07-05	Tune up, ganti oli transmisi, memperbaiki rem tromol, memperbaiki rem cakram		cmc46ubh400ketwlkkfu8nopc	2025-07-05 09:32:05.935	2025-07-05 09:32:05.935
cmcq1qlxx00nrtwsdkruo7r4k	2025-07-05	-tun up\n-Ganti oli gardan\n-ganti selang radiator \n-ganti kampas rem depan		cmc46uzp400mttwlk0oazh0s3	2025-07-05 09:33:59.829	2025-07-05 09:33:59.829
cmcq4533k00nttwsd09iolyth	2025-07-05	hari ini sab 5 juli, pagi sehabis sarapan kami berangkat menuju gg incim, memperbaiki kabel fiber optic yang ada problem, sorenya kami lanjut ke longkali memasang wifi 		cmc46pa83001dtwlkw34o2zus	2025-07-05 10:41:14.48	2025-07-05 10:41:14.48
cmcq53g9i00nvtwsdhbnov58m	2025-07-05	Day 4 PKL :\nIkut membatu memperbaiki wifi yang putus terkait hujan	https://drive.google.com/file/d/115RfulJQJIl4O_FQ8oncmJv6IaIXgw6V/view?usp=drivesdk	cmc46p64g000qtwlkv3exmjxb	2025-07-05 11:07:57.847	2025-07-05 11:09:38.438
cmcqwu1v200nxtwsd64zbgud5	2025-07-06	pada tgl 4 jumat kemaren,saya memperbaiki,power string dan setel kampas rem truk,maaf lupa buat jurnal pada hari jumat kemaren		cmc46v8mu00nrtwlkm3c62zp1	2025-07-06 00:04:28.527	2025-07-06 00:04:28.527
cmcscbp4200pntwsdc0vebgf1	2025-07-07	hari ini saya mempelajari tentang oss\n(online single submission), yaitu sistem perizinan berusaha yang di lakukan secara online 		cmc46pque003ptwlkz4fc44v0	2025-07-07 00:05:52.227	2025-07-07 00:05:52.227
cmcsetttn00qhtwsd23adav42	2025-07-07	Mengikuti kegiatan Apel gabungan	https://drive.google.com/file/d/1J2vUERQcrwlzj4muwmBxTWzQSYplP4s2/view?usp=drivesdk	cmc46rgo400a5twlk8xzlphlx	2025-07-07 01:15:57.371	2025-07-07 01:15:57.371
cmcsew8qk00qjtwsd8hez5px8	2025-07-07	Senin awal mengikuti apel pagi bersama anggota dprd kemudian setelah apel tidak ada kerjaan hanya duduk santai saja,kemudian melanjutkan mencatat disposisi serta meng copy surat kemudian mengantar surat ke lantai 2 untuk di serahkan ke Ketua		cmc46p6jo000ttwlkjoqzjw5q	2025-07-07 01:17:50.012	2025-07-07 01:17:50.012
cmcsf11sp00qntwsdmtfi6r7u	2025-07-07	senin pagi melaksanakan apel di pagi hari bersama anggota dprd dan mengantar kan berkas berkas,menulis berkas 		cmc46pdme001utwlksga35tj7	2025-07-07 01:21:34.268	2025-07-07 01:21:34.268
cmcsfcun500qxtwsdsshsr0vu	2025-07-07	hari ini saya membuat bnba kelahiran	https://drive.google.com/file/d/1QKJZKMaVFxD4GiyJF6mo5bFhcT8I6GLi/view?usp=drivesdk	cmc46qj48006wtwlkxjg53s62	2025-07-07 01:30:44.898	2025-07-07 01:30:44.898
cmcsiue5l00r1twsdbyn4wf5u	2025-07-07	Mengikuti Apel pagi dan Input pokok pikiran DPRD melalui Aplikasi SIKUMDA 		cmc46pmrj0035twlkiohdnxpz	2025-07-07 03:08:22.162	2025-07-07 03:08:22.162
cmcsjpgza00r3twsduel7rka4	2025-07-07	Mengikuti apel pagi dan input pokok pikiran DPRD melalui Apk SIKUMDA		cmc46pjq9002ptwlkdlsbonh2	2025-07-07 03:32:32.183	2025-07-07 03:32:32.183
cmcsorxeh00r7twsd6gqu83t5	2025-07-07	hari ini saya membantu melubangi kertas 	https://drive.google.com/drive/folders/1anKS73Dxi5NEgp588etqrrYTX3ydn1H-	cmc46r3af008utwlkutramzmy	2025-07-07 05:54:24.819	2025-07-07 05:54:24.819
cmcsy88ma00vrtwsdanceaf2d	2025-07-07	kami tadi di suruh untuk membuat absen hadir pkl untuk sebulan ke depan	https://drive.google.com/drive/folders/1udOtnNnD2Eh9qirSExDY79d34wNK1uWA	cmc46pt0l0041twlk75hwckll	2025-07-07 10:19:02.434	2025-07-07 10:19:02.434
cmcsojydf00r5twsd0exm4e8q	2025-07-07	*Mengganti rem belakang \n*Lanjut ke rem depan\n*Kampas rem kiri kanan \n*Pengisian minyak rem		cmc46trp000ihtwlkk9doz5ah	2025-07-07 05:48:12.867	2025-07-07 07:01:14.379
cmcszalvl00vxtwsdyt7pebqm	2025-07-07	day 5 PKL,membersihkan blok silinder,tunap,\nmembuka shock mercy dan memasangnya, 		cmc46tn5q00hytwlknc1ofewc	2025-07-07 10:48:52.545	2025-07-07 10:48:52.545
cmcszovoo00vztwsdm0xc3fhh	2025-07-07	Kegiatan kami tadi di suruh buat absen untuk satu Bulan ke depan 		cmc46q2rq005atwlks6oghu8m	2025-07-07 10:59:58.44	2025-07-07 10:59:58.44
cmcszwsgx00w1twsd4rs1t3tn	2025-07-07	tugas hari ini membuat aplikasi crud bertema sewa atau rental mobil, waktu yang di berikan untuk menyelesaikan tugas ini adalah 1 minggu, jadi 1 minggu kedepan saya akan mengerjakan tugas membuat aplikasi crud 		cmc46putt0049twlkz0v03scf	2025-07-07 11:06:07.521	2025-07-07 11:06:07.521
cmcsq10tg00rbtwsdwdafp3nv	2025-07-07	1. Membantu melayani tamu yang datang ke kantor desa dengan sikap ramah dan sopan, serta mengarahkan mereka sesuai keperluannya.\n2. Melakukan pengarsipan SKTM (Surat Keterangan Tidak Mampu) dengan menata dokumen berdasarkan nama dan nomor surat.\n3. Memberikan stempel pada surat-surat lainnya sesuai instruksi dari petugas kantor sebagai bagian dari proses administrasi.\n\nCatatan:\nPulang lebih awal pada pukul 13.30 WITA dikarenakan mengalami flu, demam, dan sakit kepala, serta sudah izin kepada pihak yang bersangkutan di kantor desa.	https://drive.google.com/drive/folders/1oGNHQSEpaaOVaUeYf4ynI_6IUDPyztwz	cmc46q5ev005jtwlkm0nl2m8g	2025-07-07 06:29:28.769	2025-07-07 06:31:41.319
cmcss3clz00rdtwsd0qi0wiet	2025-07-07	Menyalin berkas" Ke buku tulis besar dan membuat surat keterangan tidak mampu di WORD		cmc46s31000cdtwlkt2zewnu5	2025-07-07 07:27:16.632	2025-07-07 07:27:16.632
cmcss9ntc00rjtwsdv4encvc1	2025-07-07	Kegiatan yang saya lakukan hari ini\n- Apel Pagi\n- Disposisi surat masuk	https://drive.google.com/file/d/1jtfj5eA4-NUSzmII3jBo9JIHLDPg2Yag/view?usp=drivesdk	cmc46qyuo008gtwlkpfrhsk5a	2025-07-07 07:32:11.088	2025-07-07 07:32:11.088
cmcsscx6h00rltwsd7hsckvbj	2025-07-07	saya masih melanjutkan tugas ddk untuk profil desa 	https://drive.google.com/file/d/1NAjTi_-gbwxb05SbdymO02fTK-0xXb98/view?usp=drivesdk	cmc46px46004ltwlkbeei43ix	2025-07-07 07:34:43.193	2025-07-07 07:34:43.193
cmcssf37a00rvtwsdvhkugubi	2025-07-07	Bikin laporan dan fotocopy		cmc46rpmn00b3twlk3kcu7mik	2025-07-07 07:36:24.31	2025-07-07 07:36:24.31
cmcssnwk100s5twsd11fp9286	2025-07-07	hari ini mencetak sppt, pendaftaran pbb dan perhitungan pajak barang tertentu		cmc46qc9w0067twlkcuynnxtk	2025-07-07 07:43:15.602	2025-07-07 07:43:15.602
cmcsso55n00s7twsdinysrymf	2025-07-07	Hari ini menemani bu Riska ke bidang hukum kantor Sekkab, Konsultasi terkait piutang retribusi daerah	https://drive.google.com/file/d/1RurnYDGj-nLwA5uobL5Wtbxm62QZl0N8/view?usp=drivesdk	cmc46pp3s003htwlkl4no5tkd	2025-07-07 07:43:26.747	2025-07-07 07:43:26.747
cmcsst13400s9twsdndlyispu	2025-07-07	menginput perhitungan pajak barang tertentu dan menyusun arsip 		cmc46r5k40091twlkc6d32ylm	2025-07-07 07:47:14.752	2025-07-07 07:47:14.752
cmcssvn6400sftwsdp6z31g8s	2025-07-07	Kerjaan saya hari ini:\n1. mengecek hasil teller minggu kemaren\n2. membuat buku rekening\n3. membuat formulir nasabah\n4. menyimpan jaminan nasabah	https://drive.google.com/file/d/1oHHSjOoUHCvBZQG9vhmcCfmdWseGvAbm/view?usp=drivesdk	cmc46p6zu000wtwlk8cv819k1	2025-07-07 07:49:16.684	2025-07-07 07:49:16.684
cmcst1ncw00sttwsdetqlzaws	2025-07-07	- meng input data masjid yanga ada di kec babulu\n- meng input data gereja yang ada di kec babulu \n	https://drive.google.com/file/d/11lgo2CBIjt-3Gp6qI2XHQxIu84tEJUGA/view?usp=drivesdk	cmc46qeik006etwlk22jwlw57	2025-07-07 07:53:56.864	2025-07-07 07:53:56.864
cmcst21mm00svtwsd2m74rpoe	2025-07-07	-meng input data masjid dan mushola\n-meng input data gereja	https://drive.google.com/file/d/10zmWxVB5ULCH72vndpJEpo8ysIEJPKBI/view?usp=drivesdk	cmc46qufe007xtwlk6y6ld8k6	2025-07-07 07:54:15.358	2025-07-07 07:54:15.358
cmcst2g7000sxtwsdj9x2z35t	2025-07-07	mengetik nama nama calon paskib tahun 2025 kecamatan babulu		cmc46qwna0089twlkok4h7czv	2025-07-07 07:54:34.236	2025-07-07 07:54:34.236
cmcst4ltw00t5twsd8r0yb6g4	2025-07-07	Apel pagi dan mengerjakan/mengetik data data siswa-siswi paskibraka	https://drive.google.com/file/d/1Aw15HL-SGJ1NbgWzJQTAsiUqcWDjGV-o/view?usp=drivesdk	cmc46qlb20073twlkwsk9yxzh	2025-07-07 07:56:14.853	2025-07-07 07:56:14.853
cmcstaedj00tntwsd7g3fevhm	2025-07-07	mengisi data di buku agenda surat keluar-masuk tahun 2025		cmc46poab003dtwlkkkqtlmi4	2025-07-07 08:00:45.127	2025-07-07 08:00:45.127
cmcstk1js00u1twsdjk545vxk	2025-07-07	Kegiatan saya hari ini apel pagi \nMenyeken surat tanah dan ngeprint	https://drive.google.com/file/d/1EOoKjtMjiUAxBJLkYgy7U7fisxzDPSuA/view?usp=drivesdk	cmc46qgrp006ltwlkgmd3zvcp	2025-07-07 08:08:15.064	2025-07-07 08:08:15.064
cmcsto40v00u9twsdukemrz3t	2025-07-07	Hari ini saya membuat invoice dan membuat kwitansi		cmc46sc4a00datwlklba5fy78	2025-07-07 08:11:24.895	2025-07-07 08:11:24.895
cmcsto6ev00ubtwsdbk0d6pxv	2025-07-07	- foto copy berkas² \n- menginput data piagam guru sd/smp\n- meminta tanda tangan ke bidang paud dan bendahara		cmc46siu100e0twlksoir3qyk	2025-07-07 08:11:27.992	2025-07-07 08:11:27.992
cmcstvsxr00uhtwsd40ieupst	2025-07-07	Kegiatan saya hari ini di awali dengan menyapu kantor desa dan mencatat data data di buku agenda surat keluar- masuk tahun 2025		cmc46p5ql000ntwlkqrw64rf6	2025-07-07 08:17:23.775	2025-07-07 08:17:23.775
cmcsu5kny00ultwsd64kmnfqx	2025-07-07	Bersih di suruh nulis berkas 	https://drive.google.com/file/d/1BzK62U2A9EjQqgidzpw_LkiVr0LLc4Wu/view?usp=drivesdk	cmc46p7y00012twlkan1t901y	2025-07-07 08:24:59.615	2025-07-07 08:24:59.615
cmcsudowc00urtwsdq27qfsgh	2025-07-07	membantu mengaplikasikan stempel yang benar dan mengisi SKU (Surat Keterangan Usaha)	https://drive.google.com/file/d/11dQhAaWrayLKjtm_Cx1Y9H3YwIa2gBdj/view?usp=drivesdk	cmc46ra3i009ktwlk4kxhy7zp	2025-07-07 08:31:18.349	2025-07-07 08:31:18.349
cmcsux3f000v1twsd0mo4shnm	2025-07-07	Hari ini hanya menginput sedikit data tambahan	https://drive.google.com/file/d/17bXNl0IRmpktDkTDwgEQcWAC_W1HyKxj/view?usp=drivesdk	cmc46qpxp007jtwlkmf7x9mjw	2025-07-07 08:46:23.628	2025-07-07 08:46:23.628
cmcsv1vp700v5twsdsgpx17hv	2025-07-07	kegiatan saya pada hari ini yaitu melaksanakan apel pagi, mendokumentasi pekerjaan pada hari ini, menyusun kertas NCR		cmc46qs78007qtwlkv76qqm1t	2025-07-07 08:50:06.908	2025-07-07 08:50:06.908
cmcsvb9jh00v7twsdej708iiq	2025-07-07	menginput BPHTB	https://drive.google.com/drive/folders/1RTtvHNi3eXvi2-Kq51mx4WjGqsDqUJ_x	cmc46rwds00bstwlkvna2msl2	2025-07-07 08:57:24.749	2025-07-07 08:57:24.749
cmcsvix5t00vbtwsd99wx6jbx	2025-07-07	kegiatan saya hari ini\n1.menscan pesebaran pohon \n2.mencetak barkot		cmc46pq1s003ltwlkhuevqi62	2025-07-07 09:03:21.953	2025-07-07 09:03:21.953
cmcsvpg4c00vdtwsdzsyghoc3	2025-07-07	yang saya lakukan hari ini 7/7/2025\n- membantu ibu dan abang nya menghitung pengeluaran dan pemasukan/penggeseran anggaran satuan kerja perangkat daerah\n- saya belum diberi pekerjaan langsung karena sekarang yang dikerjakan deadline\n- merekap berkas yang mau di copy	https://drive.google.com/drive/folders/10BAkHL10xus6EW0arfceue-pkf-PSmKL	cmc46sgjj00dttwlk2n9q1jja	2025-07-07 09:08:26.461	2025-07-07 09:08:26.461
cmcsvs95i00vftwsdvetc20jg	2025-07-07	Membeli batrai untuk kamera canon\nMembuat tebel absen pkl		cmc46q3kk005dtwlk36s2a65a	2025-07-07 09:10:37.398	2025-07-07 09:10:37.398
cmcsvz0o800vhtwsdvyo1hde7	2025-07-07	Membuat crud dan apk sederhana (tugas seminggu)		cmc46psei003xtwlkve7bkjpy	2025-07-07 09:15:53.001	2025-07-07 09:15:53.001
cmcsw9mkn00vjtwsdi1xppwfu	2025-07-07	kegiatan saya hari ini yaitu, menandai bagian bagian laporan harian yang belum di tanda tanganin dan meminta tanda tangan 	https://drive.google.com/file/d/13sXgBhRlArqV8_Ty8_jD77HxNi1g5Itu/view?usp=drivesdk	cmc46q9ut005xtwlkhtlk8doe	2025-07-07 09:24:07.944	2025-07-07 09:24:07.944
cmcswhedm00vltwsdwbk8a4a1	2025-07-07	tugas saya hari ini mengganti kampar rem mobil	https://drive.google.com/drive/folders/1dqK0ujwwH1UmW_kgTLCtcgYbuw2MuBpy	cmc46uopi00lutwlk6ky20hrv	2025-07-07 09:30:10.57	2025-07-07 09:30:10.57
cmcswj3q700vntwsd9mmt406d	2025-07-07	Kegiatan pada 7 JULI 2025 \nmengganti kampas rem depan \nmengganti kampas rem belakang	https://drive.google.com/drive/folders/1cO6C1w2yQrxAXoU0xH3XFWMlwVCmEpIX	cmc46v45w00ndtwlk563qy6nd	2025-07-07 09:31:30.079	2025-07-07 09:31:30.079
cmcswk06300vptwsdao2q89uv	2025-07-07	kegiatan hari ini memberi tanda ke berkas yang belum di tandatangani	https://drive.google.com/file/d/1XD4VHvipTDiwvh-drPZLZyC3__66iweC/view?usp=drivesdk	cmc46rcbv009rtwlkrdwu5dht	2025-07-07 09:32:12.123	2025-07-07 09:32:12.123
cmcsz7p6d00vttwsd1tthoskt	2025-07-07	bersihkan blok silinder \nngencangin baut \nmasang kampas kopling \nmasang piston \n		cmc46t12y00fptwlkqbiheqi2	2025-07-07 10:46:36.854	2025-07-07 10:46:36.854
cmcszxtse00w3twsdco06eyd6	2025-07-07	Hari ini kami diberikan tugas crud data base, kami diberikan dan menyelesaikan itu tugas yang di berikan		cmc46q1y10055twlk6l4h720o	2025-07-07 11:06:55.886	2025-07-07 11:06:55.886
cmct002z200w5twsdtr4cv27b	2025-07-07	kegiatan minggu ini membuat aplikasi web bertema rental mobil yang menggunakan php	https://drive.google.com/drive/folders/1VFsQrrjG3taB39eb6J1h68hBbRoxYkSj?usp=drive_link	cmc46ptun0045twlkjz41wc1h	2025-07-07 11:08:41.102	2025-07-07 11:08:41.102
cmct18g4t00w9twsdz39y6evs	2025-07-07	Kegiatann hari ini\n1.apel gabungan bersama BPD, dusun \n2.mengantar visum \n3.mengurus ahli waris		cmc46rndz00awtwlkmxzfjiix	2025-07-07 11:43:11.022	2025-07-07 11:43:11.022
cmct1eody00wbtwsdeos4nqkp	2025-07-07	hari ini kegiatan saya menyusun kertas CNR		cmc46q7m6005qtwlksgmx27n4	2025-07-07 11:48:01.654	2025-07-07 11:48:01.654
cmct1i2mc00wdtwsdg96w16z1	2025-07-07	•mengerjakan rekap data BA Pengawasan pajak daerah(pajak mblb, hiburan , listrik dan air dan tanah\n•menginput ketetapan pajak reklame jatuh tempo	https://drive.google.com/drive/folders/1RhN-b5r3qAR37QHcEdcs2RqZ0dwd01z1	cmc46sl0j00e7twlkracec5rj	2025-07-07 11:50:40.068	2025-07-07 11:50:40.068
cmct1o70600wftwsdylni3sak	2025-07-07	-Bongkar pasang shock absorbers\n-pasang oil pan\n-nyuci kampas kopling\n		cmc46udog00kltwlk8mp3jpsw	2025-07-07 11:55:25.686	2025-07-07 11:55:25.686
cmct314mu00whtwsdva6tvy2l	2025-07-07	menggandakan surat, mengantar surat, dan menganalisis data	https://drive.google.com/file/d/1VfSWXbRukswnac8dfWvQ-57oxlz3_iUL/view?usp=drivesdk	cmc46s59s00cqtwlkc8385tg3	2025-07-07 12:33:28.758	2025-07-07 12:33:28.758
cmct4xcri00wjtwsdafpym1c8	2025-07-07	Membersihkan meja kerja yang saya tempati\n\n		cmc46sneu00eetwlk7gnrmbf8	2025-07-07 13:26:31.902	2025-07-07 13:26:31.902
cmct69mja00wltwsd51flapj4	2025-07-07	di hari ini saya hanya menyusun beberapa berkas, belajar meng fotocopy, menggandakan surat, dan mengantarkan beberapa surat ke bagian umum	https://drive.google.com/drive/folders/1ElihpgsucgKeKf_9-9zaK2r20RCrdEHg	cmc46s9u700d3twlkxxrzmirt	2025-07-07 14:04:04.054	2025-07-07 14:04:04.054
cmct7dmip00wntwsd5l7urkiy	2025-07-07	di hari ini saya melakukan apel pagi dan saya meminta tanda tangan\n-saya di suruh scan berkas" \n-merapikan berkas" dan  masukan ke buku arsip\n-stampel berkas"\n-ngeprin berkass	https://photos.app.goo.gl/hitE3bDN5Nh1Bmze9	cmc46rehr009ytwlk6ymfhb80	2025-07-07 14:35:10.273	2025-07-07 14:35:42.84
cmctabivp00wptwsdhx7snmvk	2025-07-07	hari ini saya merakit selinder het		cmc46v8mu00nrtwlkm3c62zp1	2025-07-07 15:57:31.093	2025-07-07 15:57:31.093
cmctqcqm100x5twsdrgfctrvj	2025-07-07	membuat Absensi dalam bentuk tabel di excel	https://drive.google.com/drive/folders/1ohWPveMYL71wt3zuv-aA6MNophK8eJfz	cmc46q15w0052twlkhtfrzd6q	2025-07-07 23:26:21.626	2025-07-07 23:26:21.626
cmctuh5jd00z9twsdhn749ed1	2025-07-08	menggandakan NPWPD		cmc46qnhi007atwlkoshg5ob4	2025-07-08 01:21:46.057	2025-07-08 01:21:46.057
cmcty9a220105twsdla5yax6r	2025-07-08	hari ini saya menjilid kutipan akta kelahiran	https://drive.google.com/file/d/15eOdif86hSPFlgfJoHPNnoP_6DAe1KMn/view?usp=drivesdk	cmc46qj48006wtwlkxjg53s62	2025-07-08 03:07:37.13	2025-07-08 03:07:37.13
cmctyen720107twsdp1sfr0wi	2025-07-08	Melanjutkan menginput pokok pikiran DPRD dan memfoto copy berkas”		cmc46pjq9002ptwlkdlsbonh2	2025-07-08 03:11:47.438	2025-07-08 03:11:47.438
cmcu8l1ip011btwsdra5fuiij	2025-07-08	-meng input data masjid labangka barat\n-mencatat nama nama orang yg menikah di bulan mei dan juni\n-menenpel foto pasangan yang menikah di akte nikah	https://drive.google.com/file/d/11Xl6EQMm81sWBwvaaW--_igm-UCwcVJK/view?usp=drivesdk	cmc46qufe007xtwlk6y6ld8k6	2025-07-08 07:56:42.097	2025-07-08 07:56:42.097
cmcuo3k6n0145twsdqkk3v7si	2025-07-08	kegiatan saya saat pkl tadi pagi saya membersihkan filter solar dan mengganti Bering asal roda depan kemudian siang sampai sore saya membantu membongkar head mobil gren mex lalu membersihkan , mengganti shock mobil pajero kemudian saya membantu mengganti kampas kopling mobil gren mex		cmc46uva300mftwlk0yfyi1q9	2025-07-08 15:11:00.336	2025-07-08 15:11:00.336
cmcu0v1dg010btwsdhla9lzwf	2025-07-08	bongkar head mobil dyna		cmc46ty9b00j2twlk0v0ot3fh	2025-07-08 04:20:31.541	2025-07-08 04:20:31.541
cmcu1t3e8010dtwsd295d5ynt	2025-07-08	Hari ini tidak terlalu banyak kegiatan hanya mengantar undangan dari dinas untuk anggota dewan ke lantai 3,Serta sedikit membantu staf TU mengfotocopy,dan menggunting file nama staf		cmc46p6jo000ttwlkjoqzjw5q	2025-07-08 04:47:00.464	2025-07-08 04:47:00.464
cmcu1zko5010ftwsdhezeilqt	2025-07-08	mengantarkan surat surat kepada anggota dprd dan menerima surat dari luar yang di catat ke buku catatan surat masuk		cmc46pdme001utwlksga35tj7	2025-07-08 04:52:02.789	2025-07-08 04:52:02.789
cmcu3kwfr010jtwsdw1sxfegu	2025-07-08	hari ini saya menjilid 	https://drive.google.com/drive/folders/1cKMdc2ReR6regd92IbV2bwjEGk5LU0PN	cmc46r3af008utwlkutramzmy	2025-07-08 05:36:37.432	2025-07-08 05:36:37.432
cmcu4ut22010ltwsdu47wrbxp	2025-07-08	hari ini saya rekap SKTM, rekap surat masuk dan surat keluar	https://drive.google.com/file/d/1K-uzljITr_xByf_4thQCHnCL4HB1-BvY/view?usp=drivesdk \nhttps://drive.google.com/file/d/1JNJVKzAX2oX0tiY2J7xn-4_pGRvfRAn3/view?usp=drivesdkhttps://drive.google.com/file/d/1J8n6oCQDLjvD43c6KIA0MEwMWIq4sn_X/view?usp=drivesdk	cmc46rgo400a5twlk8xzlphlx	2025-07-08 06:12:19.226	2025-07-08 06:12:19.226
cmcu73m9c010ptwsdvpsogexz	2025-07-08	hari pertama saya magang saya di suruh melepas kan Staples untuk memisah kn dokumen kertas hitam dan putih lalu saya Staples kembali 		cmc46p8e60015twlkpm6xqld4	2025-07-08 07:15:09.552	2025-07-08 07:15:09.552
cmcu748qc010rtwsdbd1qu0gf	2025-07-08	Mengoperasikan komputer dan printer	https://drive.google.com/drive/folders/1-0oJ6432udCYWr5p5SQVy2ouhwpaB8sM	cmc46p9dx0019twlk90er4978	2025-07-08 07:15:38.676	2025-07-08 07:15:38.676
cmcu77sag010vtwsdo7ufqjhf	2025-07-08	merekap ulang laporan	https://drive.google.com/file/d/1or6FabI0Lrzub7o8OUWPpU2WRMekYSJF/view?usp=drivesdk	cmc46q15w0052twlkhtfrzd6q	2025-07-08 07:18:23.992	2025-07-08 07:18:23.992
cmcu7ugb0010xtwsdnfnd14k8	2025-07-08	Foto copy dan Melanjutkan input pokok pikiran DPRD		cmc46pmrj0035twlkiohdnxpz	2025-07-08 07:36:01.548	2025-07-08 07:36:01.548
cmcu837de0111twsdeylk44qt	2025-07-08	kegiatan hari ini membantu memotret berkas untuk dijadikan pdf, dan membantu menulis data orang orang. 	https://drive.google.com/file/d/10-8UeltrwfC0ad0VBMkH8lEQ0z_A501I/view?usp=drivesdk	cmc46ped8001ytwlkfrb06txj	2025-07-08 07:42:49.874	2025-07-08 07:42:49.874
cmcu8gaqj0117twsd41aytrkl	2025-07-08	mengarsip dokumen	kegiatan hari pertama hanya mengarsip dokumen dan selebihnya hanya duduk santai	cmc46pizj002mtwlk8pxdg8ys	2025-07-08 07:53:00.763	2025-07-08 07:53:00.763
cmcu8idtc0119twsd6pvwn9d8	2025-07-08	melakukan pembuatan dan pencatatan SKTM, SKUN, DGSPN	https://drive.google.com/file/d/11wxWph8gzJYy6nzUvfRC8TIdQ7AJKWZN/view?usp=drivesdk	cmc46ra3i009ktwlk4kxhy7zp	2025-07-08 07:54:38.064	2025-07-08 07:54:38.064
cmcu8oc9q011ftwsd6fzk0pdp	2025-07-08	menginput dan mengupload NPWPD 		cmc46r5k40091twlkc6d32ylm	2025-07-08 07:59:15.998	2025-07-08 07:59:15.998
cmcu6w4w8010ntwsdar23vjcc	2025-07-08	– Photocopy berkas\n– Photocopy berkas part 2\n– Photocopy berkas part 3\n– Photocopy berkas part 4\n– Meminta ttd dan sk\n– Membantu memindai dokumen 		cmc46ryle00bztwlkx7awij04	2025-07-08 07:09:20.456	2025-07-10 07:55:14.545
cmcv32u8q014btwsd6t7xqiwr	2025-07-08	Day 6 PKL :\nHari ini memeriksa jaring wifi yang mengalami ganggu 	https://drive.google.com/file/d/1-8MVs43iKK11e4-IsqBZZ50Y-17Pg-js/view?usp=drivesdk	cmc46p64g000qtwlkv3exmjxb	2025-07-08 22:10:20.903	2025-07-08 22:19:52.314
cmctzndj20109twsdib69it8c	2025-07-08	-input data\n-mengantarkan absen 	https://drive.google.com/file/d/1-69ctgxDzbavG65oZ2L1ibSTjawBNijI/view?usp=drivesdk	cmc46sneu00eetwlk7gnrmbf8	2025-07-08 03:46:34.427	2025-07-09 08:42:27.547
cmcu8olp0011htwsdtnrz62j7	2025-07-08	- meng input data masjid labangka barat\n- mengcatat nama pasangan yang menikah di bulan mei dan juni\n- menempel foto pasangan di akte nikah	•https://drive.google.com/file/d/12QFDjE8JEDHP0jhCQmAErZCipFSVqr9Z/view?usp=drivesdk\n•https://drive.google.com/file/d/12jxWqjqosSgj92mZyoOe2_wb3QwiCT3q/view?usp=drivesdk\n•https://drive.google.com/file/d/12jeR4uhZDmxXpzYyYWZdDIe1hg6LBq2t/view?usp=drivesdk\n•https://drive.google.com/file/d/12iNQBhZoZlAvoiL-GlcbFBzrQBweDhGt/view?usp=drivesdk\n•https://drive.google.com/file/d/12XQCcDyWafy9VvRoddNL4q7taPZJzsSO/view?usp=drivesdk\n•https://drive.google.com/file/d/12TBPtfUw5HiX4mPepohyedToekTgmveQ/view?usp=drivesdk	cmc46qeik006etwlk22jwlw57	2025-07-08 07:59:28.213	2025-07-08 07:59:28.213
cmcu8r4wb011ltwsdlwvgrpfw	2025-07-08	Kegiatan hari ini isi data kartu keluarga dan nyatat nota		cmc46phg0002dtwlkt8tcx2ia	2025-07-08 08:01:26.411	2025-07-08 08:01:26.411
cmcu8r52z011ntwsdkugvnvmy	2025-07-08	Kegiatan isi data kk dan catatan tanah		cmc46seaw00dhtwlknxsz3ms1	2025-07-08 08:01:26.652	2025-07-08 08:01:26.652
cmcu8s7wg011ttwsdzmrk5zby	2025-07-08	- mengikuti kegiatan sosialisasi spi (survei penilaian integritas) \n- foto copy berkass²\n- antar surat dan minta tanda tangan di bidang sekertaris, paud, dan dikdas		cmc46siu100e0twlksoir3qyk	2025-07-08 08:02:16.961	2025-07-08 08:02:16.961
cmcu8wueq0121twsd829qtx8q	2025-07-08	kegiatan saya pada hari ini yaitu menyusun kertas ncr, mencatat  dan menyusun surat masuk dan mengeprint permintaan data TW II		cmc46qs78007qtwlkv76qqm1t	2025-07-08 08:05:52.754	2025-07-08 08:05:52.754
cmcu8x1100123twsdsmbzm1k1	2025-07-08	kegiatan hari ini hanya membuat regalisasi ahli waris		cmc46qwna0089twlkok4h7czv	2025-07-08 08:06:01.332	2025-07-08 08:06:01.332
cmcu8xjim0125twsdrp84ny7j	2025-07-08	Kegiatan yang saya lakukan hari ini \n- Disposisi surat masuk\n- Mencatat dan penomoran  padasurat perintah tunas ( SPD) dan surat perjalanan dinas	https://drive.google.com/file/d/1kKXUebJ9-SRjegRi4pJ-Lslzr40lhTtB/view?usp=drivesdk	cmc46qyuo008gtwlkpfrhsk5a	2025-07-08 08:06:25.294	2025-07-08 08:06:25.294
cmcu8y1zn0129twsddqa35une	2025-07-08	mengisi/menulis data regalisasi ahli waris		cmc46qlb20073twlkwsk9yxzh	2025-07-08 08:06:49.236	2025-07-08 08:06:49.236
cmcu8ymgv012btwsdbg7w1mhq	2025-07-08	hari ini kegiatan saya menyusun kertas ncr, mencatat  dan menyusun surat masuk dan mengeprint permintaan data TW II		cmc46q7m6005qtwlksgmx27n4	2025-07-08 08:07:15.775	2025-07-08 08:07:15.775
cmcu9gkmr012jtwsdd265l2xe	2025-07-08	Hari seperti biasa nya saya menyapu mencatat data data di buku keluar- masuk tahun 2025\n		cmc46p5ql000ntwlkqrw64rf6	2025-07-08 08:21:13.203	2025-07-08 08:21:13.203
cmcu9qqz0012ltwsd0aketh41	2025-07-08	Kegiatan hari ini buat surat data tanah dan nyeken surat tanah	https://drive.google.com/file/d/1iQEQJvrCFIADhmWMJGELXPcltWpxmYbx/view?usp=drivesdk	cmc46qgrp006ltwlkgmd3zvcp	2025-07-08 08:29:07.98	2025-07-08 08:29:07.98
cmcu9s13a012ntwsdytjd0eai	2025-07-08	Kegiatan saya hari ini:\n1. menyusun data nasabah\n2. mengubah nama akuntansi txt harian \n3. memprint data nasabah	https://drive.google.com/file/d/1nQ9RfQBmcXQt024MH5lWIbmVwBV3xshQ/view?usp=drivesdk	cmc46p6zu000wtwlk8cv819k1	2025-07-08 08:30:07.75	2025-07-08 08:30:07.75
cmcu9xxin012ptwsdb9dvc2p0	2025-07-08	Menyatat data bayi thun 2025		cmc46s31000cdtwlkt2zewnu5	2025-07-08 08:34:43.056	2025-07-08 08:34:43.056
cmcua39tf012rtwsd4jamtqbn	2025-07-08	Hari ini kami menyusun laporan pemilu	https://photos.app.goo.gl/yEwp8HHAiUNdNnnz5	cmc46q3kk005dtwlk36s2a65a	2025-07-08 08:38:52.275	2025-07-08 08:38:52.275
cmcua67fd012ttwsdxpfqg5gd	2025-07-08	menginput BPHTB\nmengeprint		cmc46rwds00bstwlkvna2msl2	2025-07-08 08:41:09.145	2025-07-08 08:41:09.145
cmcuafqj5012vtwsdy8iakllt	2025-07-08	Menginput data, mengisi data pengantin dan melengkapi berkas berkas data pengantin		cmc46qpxp007jtwlkmf7x9mjw	2025-07-08 08:48:33.809	2025-07-08 08:48:33.809
cmcuar0g50135twsd09n3wleh	2025-07-08	kegiatan pada 8 juli 2025\nmengganti kampas kopling	https://drive.google.com/drive/folders/1cO6C1w2yQrxAXoU0xH3XFWMlwVCmEpIX	cmc46v45w00ndtwlk563qy6nd	2025-07-08 08:57:19.878	2025-07-08 08:57:48.769
cmcuarsoe0137twsdkx6yl0ct	2025-07-08	- mengganti oli mesin + filter udara\n- mengganti kampas kopling \n- mengganti kampas rem	https://drive.google.com/drive/folders/1ef0cPes2a9-LEo472ZphqMhHknLsLK1n	cmc46uopi00lutwlk6ky20hrv	2025-07-08 08:57:56.463	2025-07-08 08:57:56.463
cmcuastl0013btwsdczw6xqn5	2025-07-08	Kegiatan kami tadi buat laporan jurnal\n		cmc46q2rq005atwlks6oghu8m	2025-07-08 08:58:44.292	2025-07-08 08:58:44.292
cmcuate1v013dtwsd9dwz0us5	2025-07-08	-menyusun laporan hasil pemilihan \n-me sortir laporan hasil pemilihan sesuai dengan daerah kecamatannya\n-membuat tabel laporannya di excel	https://drive.google.com/drive/folders/1udOtnNnD2Eh9qirSExDY79d34wNK1uWA	cmc46pt0l0041twlk75hwckll	2025-07-08 08:59:10.819	2025-07-08 08:59:10.819
cmcuawn2h013ftwsdm9cqt5ww	2025-07-08	saya sedang melakukan scan surat tanah 	https://drive.google.com/file/d/1NrgpvRJbxhiEUang7fybggOF7XpbCOa3/view?usp=drivesdk	cmc46px46004ltwlkbeei43ix	2025-07-08 09:01:42.474	2025-07-08 09:01:42.474
cmcub4tj0013htwsd5i1ndnng	2025-07-08	kegiatan hari ini, membersihkan kantor, membakar sampah, memasukkan laporan harian ke dalam gobin	https://drive.google.com/file/d/14Gvj07u0ZD6MJjkbzjGnA7RsVYSbG1gc/view?usp=drivesdk	cmc46q9ut005xtwlkhtlk8doe	2025-07-08 09:08:04.092	2025-07-08 09:08:04.092
cmcubc22x013jtwsdvmlu4371	2025-07-08	kegiatan hari ini membersihkan kantor, menyusun dan memasukkan laporan harian ke dalam gobin.	https://drive.google.com/file/d/1XPHh6Qk6bd9F7IsRcdi_RcabZ8bmpbK1/view?usp=drivesdk	cmc46rcbv009rtwlkrdwu5dht	2025-07-08 09:13:41.769	2025-07-08 09:13:41.769
cmcubyfoz013ntwsd6u9hvp06	2025-07-08	yang saya lakukan hari ini 8/7/2025\n- hari ini saya ga banyak melakukan pekerjaan karena ibu sama abang nya lagi ngantar berkas-berkas kemaren ke bk dan sekalian mereka minta stempel\nmelipat kotak arsip	https://drive.google.com/drive/folders/1082Jhq132PHp_n8jI0ZgDbZaB2ojnaQj	cmc46sgjj00dttwlk2n9q1jja	2025-07-08 09:31:05.843	2025-07-08 09:31:05.843
cmcufwqki013ptwsdrtfk0503	2025-07-08	-naik mesin avanza\n-cuci head \n-pasang power steering		cmc46udog00kltwlk8mp3jpsw	2025-07-08 11:21:45.091	2025-07-08 11:21:45.091
cmcufxkim013rtwsdxkiwx226	2025-07-08	-Ganti vabelt \n-ganti oli \n-servis kampas rem depan belakang \n\n		cmc46uzp400mttwlk0oazh0s3	2025-07-08 11:22:23.902	2025-07-08 11:22:23.902
cmcufxqrg013ttwsdqzyydcnr	2025-07-08	pasang pistering bersihkan klep\nbersihin hed		cmc46tn5q00hytwlknc1ofewc	2025-07-08 11:22:31.996	2025-07-08 11:22:31.996
cmcufy4lz013vtwsdrl3uyve3	2025-07-08	Ganti oli, servis rem cakram, tune up		cmc46ubh400ketwlkkfu8nopc	2025-07-08 11:22:49.944	2025-07-08 11:22:49.944
cmcufz8x2013xtwsdhnr3fv23	2025-07-08	tugas minggu ini masih melanjutkan yang kemaren	https://drive.google.com/drive/folders/1VFsQrrjG3taB39eb6J1h68hBbRoxYkSj?usp=drive_link	cmc46ptun0045twlkjz41wc1h	2025-07-08 11:23:42.182	2025-07-08 11:23:42.182
cmcuh4w78013ztwsd2r5gze9w	2025-07-08	hri ini\npendaftaran pbb,mengisi  spop		cmc46qc9w0067twlkcuynnxtk	2025-07-08 11:56:05.252	2025-07-08 11:56:05.252
cmcui3hqx0141twsda1jqeq1u	2025-07-08	Hari ini saya mengcopy berkas di mesin fotocopy,, Lanjut ikut Bu Riska ke kantor BKAD, Rekonsiliasi pendapatan retribusi daerah tahun 2025 semester 1 di ruang rapat BKAD.	https://drive.google.com/file/d/1SQd0kp88WaEhE9-TtqxFp9ZLs0zAEZiB/view?usp=drivesdk	cmc46pp3s003htwlkl4no5tkd	2025-07-08 12:22:59.481	2025-07-08 12:22:59.481
cmcuiiw7h0143twsdkta8xc4x	2025-07-08	kegiatan hari ini \n1.mengurus SKTM 2 kali\n2.nengurus ahli waris		cmc46rndz00awtwlkmxzfjiix	2025-07-08 12:34:58.061	2025-07-08 12:34:58.061
cmcuowz750147twsd4afg82w1	2025-07-08	ĥari ini saya memperbaiki power stering,dan membantu mekanik menaikan mesin,dan membersihkan slider het		cmc46v8mu00nrtwlkm3c62zp1	2025-07-08 15:33:52.817	2025-07-08 15:33:52.817
cmcupvf310149twsd233a5gq2	2025-07-08	Membuat crud dan apk sederhana (tugas seminggu)		cmc46psei003xtwlkve7bkjpy	2025-07-08 16:00:39.709	2025-07-08 16:00:39.709
cmct14m0s00w7twsdopmxjuly	2025-07-07	Day 5 PKL :\nMencoba memasan wifi tipe tiang	https://drive.google.com/drive/folders/1-6Sua6unCx7OLWj5Oioyb8puA1Iiquu9 	cmc46p64g000qtwlkv3exmjxb	2025-07-07 11:40:12.029	2025-07-08 22:15:22.978
cmcv5oss5014ltwsd0ptmhwwq	2025-07-08	saya melanjutkan tugas aplikasi crud yg temanya sewa atau rental mobil 		cmc46putt0049twlkz0v03scf	2025-07-08 23:23:24.725	2025-07-08 23:23:24.725
cmcv6h6j7015xtwsd4m250foo	2025-07-08	di hari ini saya membuat mengangkat barang" untuk rapat\n-Meminta tanda tangan \n-menaro dokumen ke tempat arsip\n-mengarsipkan dokumen \n-bikin surat pengantar pos \n-membantu mengantar minuman	https://photos.app.goo.gl/7N6RmKfEwsfeUfPX8	cmc46rehr009ytwlk6ymfhb80	2025-07-08 23:45:28.915	2025-07-08 23:46:07.214
cmcv6zr8a016htwsdzk8ixczm	2025-07-08	 kegiatan saya menscan dokumen penyebaran pohon 		cmc46pq1s003ltwlkhuevqi62	2025-07-08 23:59:55.547	2025-07-08 23:59:55.547
cmcubgqhq013ltwsdtr2b7hfg	2025-07-08	Di hari pertama, Saya mengerjakan sebuah file absen masuk pkl menggunakan laptop di aplikasi canva.	https://drive.google.com/file/d/18kCYwhOaSs-YkvWx7EmCK26VZ-zOi_22/view?usp=drivesdk	cmc46pnhf003atwlk0zw4shj9	2025-07-08 09:17:20.031	2025-07-09 00:02:35.657
cmcva6w7p0187twsdqsgh8u3s	2025-07-09	Rekap daftar hadir Anggota DPRD		cmc46pmrj0035twlkiohdnxpz	2025-07-09 01:29:27.445	2025-07-09 01:29:27.445
cmcva7v2c0189twsdr33f5so3	2025-07-09	Merekap daftar hadir		cmc46pjq9002ptwlkdlsbonh2	2025-07-09 01:30:12.612	2025-07-09 01:30:12.612
cmcvaofei018dtwsde5ow6scy	2025-07-09	Kegiatan hari ini saya mengukur panjang dan lebar persegi empat batu dan mengukur diameternya 		cmc46pl8k002xtwlkrv1parfp	2025-07-09 01:43:05.466	2025-07-09 01:43:05.466
cmcvbp4uz018htwsdj11b03wj	2025-07-09	mengukur panjang lebar diameter batu.		cmc46pghq0029twlka9885aqa	2025-07-09 02:11:38.075	2025-07-09 02:11:38.075
cmcvbqesy018jtwsd9w0c7rz1	2025-07-09	Kegiatan saya pada hari ini mengukur panjang lebar diameter batu 		cmc46pc16001ltwlkd7477efh	2025-07-09 02:12:37.618	2025-07-09 02:12:37.618
cmcvbtyua018ltwsdt0l0ivq1	2025-07-09	Mengganti Bering roda\nMemperbaiki radiator mobil		cmc46trp000ihtwlkk9doz5ah	2025-07-09 02:15:23.525	2025-07-09 02:15:23.525
cmcvbu3bp018ntwsdhvxznv6h	2025-07-09	mengganti Bering roda, memperbaiki radiator,ganti Rante Doble 		cmc46u74o00k0twlk19qr70iq	2025-07-09 02:15:29.365	2025-07-09 02:15:29.365
cmcvd1rf9018ptwsdxfbhvh4e	2025-07-09	saya disuruh mengerjakan mengetik di excel untuk merekap bnba blm lahir daerah sepaku	https://drive.google.com/file/d/1VDrdZBzTqp8eZV7l-IkE7FR7nxuu7V03/view?usp=drivesdk	cmc46qj48006wtwlkxjg53s62	2025-07-09 02:49:26.806	2025-07-09 02:49:26.806
cmcvhrx58018rtwsdentg99gb	2025-07-09	Hari ini saya meminta tanda tangan ke pemilik warung makan catering langganan DPRD untuk melengkapi dokumentasi yang telah di rekap oleh staf TU		cmc46p6jo000ttwlkjoqzjw5q	2025-07-09 05:01:45.74	2025-07-09 05:01:45.74
cmcvjwbb1018ttwsduxbmrxpw	2025-07-09	Pelayanan SKCK, pengaplikasian komputer ngeprint file 		cmc46p9dx0019twlk90er4978	2025-07-09 06:01:09.949	2025-07-09 06:01:09.949
cmcvkfw3u018vtwsdxv1fao65	2025-07-09	pendaftaran pbb dan print		cmc46qc9w0067twlkcuynnxtk	2025-07-09 06:16:23.371	2025-07-09 06:16:43.003
cmcvkpc22018xtwsds44iim23	2025-07-09	kegiatan hari ini merekap arsip 		cmc46p8e60015twlkpm6xqld4	2025-07-09 06:23:43.946	2025-07-09 06:23:43.946
cmcvkrnp7018ztwsdi8f36oyf	2025-07-09	-meng input data nama nama bulan dan nomor nikah orang di tahun 2022	https://drive.google.com/file/d/12FJXB7mXuKG-hZjV2PmEqbVrPY8XdyGO/view?usp=drivesdk	cmc46qufe007xtwlk6y6ld8k6	2025-07-09 06:25:32.347	2025-07-09 06:25:32.347
cmcvmloep0199twsd4wadf59h	2025-07-09	Kegiatan hari ini memprint dokumen dan membantu menyusun beberapa buku kemudian membuat file \nHari senin dan selasa sama sekali tidak ada kegiatan		cmc46pctz001ptwlko6va5kot	2025-07-09 07:16:52.561	2025-07-09 07:16:52.561
cmcvnh05h019vtwsd9d3m3qar	2025-07-09	Mencatat data warga yang mau nikah ditahun 2025		cmc46s31000cdtwlkt2zewnu5	2025-07-09 07:41:14.117	2025-07-09 07:41:14.117
cmcvn508i019ftwsdo1phe1sg	2025-07-09	Membuat Excel		cmc46seaw00dhtwlknxsz3ms1	2025-07-09 07:31:54.355	2025-07-09 07:31:54.355
cmcvn2spt019btwsdy7tc9qnl	2025-07-09	saya mengerjakan rekap data pengangguran desa, dan bikin surat SKTM	https://drive.google.com/file/d/1KK_5auCJtKCVrD6zlrhVzwMLdqeJirQb/view?usp=drivesdk	cmc46rgo400a5twlk8xzlphlx	2025-07-09 07:30:11.297	2025-07-09 07:32:26.899
cmcvn6ogv019htwsdh7r3ead2	2025-07-09	Kegiatan hari ini membuat excel	https://drive.google.com/file/d/1Ny9l5GGk2BeYp0BPcioB_2x01cI3DHjO/view?usp=drivesdk	cmc46phg0002dtwlkt8tcx2ia	2025-07-09 07:33:12.415	2025-07-09 07:33:12.415
cmcvnayey019jtwsdf5yby55w	2025-07-09	kegiatan hari ini membantu merapikan berkas. 	https://drive.google.com/file/d/12lWs7Puf0r9zGOyoDgvKuTw0H428yq-9/view?usp=drivesdk	cmc46ped8001ytwlkfrb06txj	2025-07-09 07:36:31.931	2025-07-09 07:36:31.931
cmcvo3h6h01aztwsdmzwlfr9g	2025-07-09	- mendata pengantin tahun ini 		cmc46qeik006etwlk22jwlw57	2025-07-09 07:58:42.617	2025-07-09 07:58:42.617
cmcu81huj010ztwsd5hddu8uf	2025-07-08	hari ini saya melakukan proses digitalisasi dokumen resmi di kantor desa. kegiatan diawali dengan memotret surat resmi menggunakan kamera HP untuk kemudian dikonversi menjadi file PDF.	https://drive.google.com/file/d/1sIYKGdurkzWChJwhv2wiD87kP3mOXQVe/view?usp=drivesdk	cmc46pkez002ttwlknaeob0ip	2025-07-08 07:41:30.139	2025-07-09 07:40:57.931
cmcvncqgp019ltwsdfpz1pbk6	2025-07-09	pada hari ini saya membantu kegiatan administrasi di kantor desa, khususnya dalam proses menstaples dokumen surat pernyataan penguasaan fisik bidang tanah. dokumen yang sudah dicetak dan dirapikan kemudian distaples pada bagian atas kiri agar rapi.\n	https://drive.google.com/file/d/1uJ43rmiQIbL10K3PCTdRdt3c2nwF0h6k/view?usp=drivesdk	cmc46pkez002ttwlknaeob0ip	2025-07-09 07:37:54.937	2025-07-09 07:43:21.953
cmcoggb9000kntwsd1td8iopg	2025-07-04	hari ini saya ikut serta dalam kegiatan posyandu lansia. tugas saya adalah membantu petugas posyandu dalam mendata, membagikan serta mengatur buku\nselain itu, saya juga membantu mengatur antrian, dan memanggil nama sesuai urutan.	https://drive.google.com/file/d/1prgLo-b5nHtwZ42-zuxjEXhainZTICpL/view?usp=drivesdk	cmc46pkez002ttwlknaeob0ip	2025-07-04 06:50:21.3	2025-07-09 07:47:18.589
cmcvnpn8a01a1twsdxbkb3b78	2025-07-09	pekerjaan hari ini saya  nge print dokumen,dan membantu menyusun buku di rak buku,dan membuat file,sekian 		cmc46pi7s002htwlk9tebi51u	2025-07-09 07:47:57.274	2025-07-09 07:47:57.274
cmcvo221h01aptwsdfotgh8dm	2025-07-09	Stempel laporan kepala desa		cmc46rixs00aitwlkpg86h565	2025-07-09 07:57:36.342	2025-07-09 07:57:36.342
cmcvo2tjw01attwsdvzaor8rd	2025-07-09	hari ini kegiatan saya mencatat dan menyusun surat masuk dan menempel nama pada undangan serta membungkusnya 		cmc46q7m6005qtwlksgmx27n4	2025-07-09 07:58:11.997	2025-07-09 07:58:11.997
cmcvo38yv01axtwsdf0bld3xa	2025-07-09	menyusun surat masuk, menempel nama pada undangan dan membungkus undangan		cmc46qs78007qtwlkv76qqm1t	2025-07-09 07:58:31.976	2025-07-09 07:58:31.976
cmcvo4lnp01b1twsdc20v5krf	2025-07-09	Kegiatan hari ini membuat surat laporan gerakan tanam dan ngeprint \ndan membungkus undangan 	https://drive.google.com/file/d/1w9re_HoPpVEs5_IeKK7_eWsydSE6JLsS/view?usp=drivesdk	cmc46qgrp006ltwlkgmd3zvcp	2025-07-09 07:59:35.077	2025-07-09 07:59:35.077
cmcvm0u310195twsd1eytjplp	2025-07-09	Hari ini saya rekapitulasi data perizinan apoteker dan perawat		cmc46pp3s003htwlkl4no5tkd	2025-07-09 07:00:40.142	2025-07-11 04:14:44.241
cmcvlyl1m0191twsd1omzmxcc	2025-07-09	– Membawakan surat ke bidang keuangan \n– Meminta tanda tangan ke kabid dikdas, pak ismail\n– Photocopy nota pengeluaran dana		cmc46ryle00bztwlkx7awij04	2025-07-09 06:58:55.114	2025-07-10 07:54:40.681
cmcyg1tak01p7twsdrsyi4zqi	2025-07-11	Ngeprint\nMenginput data rekapan\nBantu stempel undangan dan ngelipat		cmc46s31000cdtwlkt2zewnu5	2025-07-11 06:36:46.604	2025-07-11 06:36:46.604
cmcyg7uf601pbtwsdtcxn9ocy	2025-07-11	– Memasukan berkas ke surat masuk dan surat keluar\n– Stempel berkas\n– Stempel berkas part 2\n– Mengantarkan surat dan Meminta tanda tangan\n– Meminta nomor SK\n– Photocopy berkas\n– Photocopy berkas part 2		cmc46ryle00bztwlkx7awij04	2025-07-11 06:41:28.003	2025-07-11 06:41:28.003
cmcvo7ciu01bbtwsd37xsmh70	2025-07-09	Bikin lapaoran desa	https://drive.google.com/file/d/1G3-1QUIXKzbALy3OOF8THu6Ou4r_SE5J/view?usp=drivesdk	cmc46rpmn00b3twlk3kcu7mik	2025-07-09 08:01:43.206	2025-07-09 08:01:43.206
cmcvobyng01bttwsdij62vea8	2025-07-09	- ngantar surat dan minta tanda tangan di bidang dikdas, paud, pora, keuangan, program, sekertaris, pengawas. \n- merapikan berkas\n- foto copy berkas²		cmc46siu100e0twlksoir3qyk	2025-07-09 08:05:18.509	2025-07-09 08:05:18.509
cmcvokug801c3twsdk31pv7az	2025-07-09	- apel pagi \n- memperbaiki king pen truk\n- memperbaiki per truk	https://drive.google.com/file/d/13rBjFby-tReIqFwQdYxArMknlPSoqXLA/view?usp=drivesdk	cmc46t5kl00g8twlkurga8kks	2025-07-09 08:12:12.968	2025-07-09 08:12:12.968
cmcvoqz7l01c7twsdnvf49m8r	2025-07-09	hari ini saya ga melakukan banyak pekerjaan\nngeprint beberapa berkas 	https://drive.google.com/drive/folders/12s5zEXP5hMtse3_MiqKfM8qoOfnvSp0z	cmc46sgjj00dttwlk2n9q1jja	2025-07-09 08:16:59.073	2025-07-09 08:16:59.073
cmcvoycrw01cjtwsdvu10gzua	2025-07-09	Kegiatan yang saya lakukan hari ini\n- Disposisi  surat masuk\n- Menyusun dokumen 	https://drive.google.com/file/d/1ktvnSwUczU45fg_eU4lPetKckgo9eJ0N/view?usp=drivesdk	cmc46qyuo008gtwlkpfrhsk5a	2025-07-09 08:22:43.244	2025-07-09 08:22:43.244
cmcvp1qaw01cptwsdpnoi4asc	2025-07-09	menginput data dan menyusun buku baca beranimasi	https://drive.google.com/file/d/129CIhCBpMHLuthwoY5gpzxEMFa9Cq5P7/view?usp=drivesdk	cmc46ra3i009ktwlk4kxhy7zp	2025-07-09 08:25:20.745	2025-07-09 08:25:20.745
cmcvp2tvb01crtwsdhep3hp8n	2025-07-09	membuat surat dispensasi siswa calon paskibra,  dan menyusun dokumen		cmc46qwna0089twlkok4h7czv	2025-07-09 08:26:12.023	2025-07-09 08:26:12.023
cmcvp3n9t01cttwsdtp715b0r	2025-07-09	Hari ini saya membantu memasak dan menyeken data data		cmc46p5ql000ntwlkqrw64rf6	2025-07-09 08:26:50.13	2025-07-09 08:26:50.13
cmcvp9wqd01cvtwsdar8yqoma	2025-07-09	1. membakar sampah\n2. membersihkan kantor \n3. mengambil nota tempat Ali\n4. membeli tisu untuk kantor \n5. mencari makanan	https://drive.google.com/file/d/14ZkJB0BnxUpgdCyRZl4Bz8okxRqI6Zh8/view?usp=drivesdk	cmc46q9ut005xtwlkhtlk8doe	2025-07-09 08:31:42.326	2025-07-09 08:31:42.326
cmcvpa06r01cxtwsd9timo78t	2025-07-09	kegiatan hari ini membersihkan kantor, membeli peralatan kantor.	https://drive.google.com/file/d/1XrWWyQec4xoBKq54WYGUxYcVswc9hbqu/view?usp=drivesdk	cmc46rcbv009rtwlkrdwu5dht	2025-07-09 08:31:46.804	2025-07-09 08:31:46.804
cmcvpbap501cztwsd7nqqi86d	2025-07-09	Hari ini menyelesaikan laporan kinerja	https://photos.app.goo.gl/QZxMW6ESsf3rpAVh9	cmc46q3kk005dtwlk36s2a65a	2025-07-09 08:32:47.081	2025-07-09 08:32:47.081
cmcvq7g9f01d7twsdtcp3fvtu	2025-07-09	Servis rutin pergantian oli dan pengecekan	https://drive.google.com/drive/folders/1cO6C1w2yQrxAXoU0xH3XFWMlwVCmEpIX	cmc46v45w00ndtwlk563qy6nd	2025-07-09 08:57:47.284	2025-07-09 08:57:47.284
cmcvqh35101dbtwsdzco24yqs	2025-07-09	membuat surat permohonan izin meminjam tenda kerucut kepada kepala desa babulu darat, menyusun dokumen, dan menempel nama nama di undangan 		cmc46qlb20073twlkwsk9yxzh	2025-07-09 09:05:16.837	2025-07-09 09:05:16.837
cmcvrtxqk01ddtwsd8d2d601m	2025-07-09	Hari ini menyortir data pengantin yang belum cukup umur dan menyalin data jumlah yang menikah kelaptop lalu menyusun berkas-berkasnya (hanya ber 2:))	https://drive.google.com/file/d/17bXNl0IRmpktDkTDwgEQcWAC_W1HyKxj/view?usp=drivesdk	cmc46qpxp007jtwlkmf7x9mjw	2025-07-09 09:43:15.98	2025-07-09 09:43:15.98
cmcvsl2vp01dftwsdfmx8qjjs	2025-07-09	- mengganti pompa minyak rem\n- mengganti oli + filter udara	https://drive.google.com/drive/folders/1g1PiB8X46iltom_NAKWnxfkxMzCU7E1P	cmc46uopi00lutwlk6ky20hrv	2025-07-09 10:04:22.357	2025-07-09 10:04:22.357
cmcvsmu6h01dhtwsdt8eqpe8b	2025-07-09	Mencatat pembelian dan membuat invoice		cmc46sc4a00datwlklba5fy78	2025-07-09 10:05:44.394	2025-07-09 10:05:44.394
cmcvtrt0601djtwsdcpj6x826	2025-07-09	-ngunci arm\n-pasang spacer ban depan\n-lepas shock		cmc46udog00kltwlk8mp3jpsw	2025-07-09 10:37:35.767	2025-07-09 10:37:35.767
cmcvtuua901dltwsd057c2k4w	2025-07-09	kegiatan saya hari ini:\n1. mengecek slip tarik nasabah\n2. mencari data nasabah\n3. menyimpan slip pengeluaran kas\n4. pelepasan anak magang yg sebelum saya	https://drive.google.com/file/d/1SafVjFqppKacoOnNEMeqBd4tKOSY66HM/view?usp=drivesdk	cmc46p6zu000wtwlk8cv819k1	2025-07-09 10:39:57.394	2025-07-09 10:39:57.394
cmcvwf46c01dntwsdl8qxjtd2	2025-07-09	Bersih bersih ruang sebelum melakukan kegiatan lain lainnya, disuruh fotocopy lembar berkas 	https://drive.google.com/file/d/1CNyMsaSJjFdej29gzSog9p8YPaYoHdvj/view?usp=drivesdk	cmc46p7y00012twlkan1t901y	2025-07-09 11:51:42.564	2025-07-09 11:53:45.936
cmcvy7dwz01dptwsddkkm0bcb	2025-07-09	memasang seprecer ban Brio kanan kiri\nmembuka tangki mobil ga tau mobil apa lupa,membantu masang baut kop mesin		cmc46tn5q00hytwlknc1ofewc	2025-07-09 12:41:41.171	2025-07-09 12:41:41.171
cmcvylv1o01drtwsdzj4n4qz6	2025-07-09	kegiatan saya adalah masih menscan dokumen penyebaran pohon		cmc46pq1s003ltwlkhuevqi62	2025-07-09 12:52:56.556	2025-07-09 12:52:56.556
cmcvyop3301dttwsd79g7xdhx	2025-07-09	buat surat pernyataan, lalu print dan fotocopy	https://drive.google.com/file/d/1WkTc4dCLmtTRO4v-41SCRuRhmFsdOJ5y/view?usp=drivesdk	cmc46s59s00cqtwlkc8385tg3	2025-07-09 12:55:08.8	2025-07-09 12:55:08.8
cmcvzdg9q01dvtwsdt79hlst4	2025-07-09	kegiatan saya hari ini\n-mengganti kampas kopling\n-mengganti as roda depan \n-meberikan head \n-mengganti oli+filter udara		cmc46uva300mftwlk0yfyi1q9	2025-07-09 13:14:23.774	2025-07-09 13:14:23.774
cmcw05gna01dxtwsdlo7fmap4	2025-07-09	-ganti oli\n-ganti koil sama busi\n-servis rem depan belakang \n		cmc46uzp400mttwlk0oazh0s3	2025-07-09 13:36:10.63	2025-07-09 13:36:10.63
cmcw07ttt01dztwsd8s2561ia	2025-07-09	Ganti oli gardan, ganti oli mesin, ganti rem cakram, tune up		cmc46ubh400ketwlkkfu8nopc	2025-07-09 13:38:01.025	2025-07-09 13:38:01.025
cmcw0csvg01e1twsdo49q51tt	2025-07-09	psang tutup hed \nmasang radiator \nmasang blower \nngencangin baut kenalpot \nmasang bemper depan \nbuka baut tengki mobil 		cmc46t12y00fptwlkqbiheqi2	2025-07-09 13:41:53.068	2025-07-09 13:41:53.068
cmcw0nqle01e3twsdu523l25b	2025-07-09	Membuat crud dan apk sederhana (tugas seminggu)		cmc46psei003xtwlkve7bkjpy	2025-07-09 13:50:23.33	2025-07-09 13:50:23.33
cmcw1wahv01e5twsdb07eog22	2025-07-09	harii ini tidak ad tugas, hanya membantu memasak untuk dikirim ke polsek\n	https://drive.google.com/file/d/1OWWj3dsYFzktS9jf-oGbuBBvmPBxukd8/view?usp=drivesdk	cmc46px46004ltwlkbeei43ix	2025-07-09 14:25:01.987	2025-07-09 14:27:46.525
cmcwn5gya01gjtwsdi50zhtwn	2025-07-09	Dihari kedua Saya mengganti tanggal,bulan. Dan belajar mencetak print lalu mengeklik lembaran-lembaran dan mengantarkannya ke ruangan lantai atas.	https://drive.google.com/file/d/1bx6B5dqicyZ34LiWNpYB11U6VcX31JsT/view?usp=drivesdk	cmc46pnhf003atwlk0zw4shj9	2025-07-10 00:20:02.194	2025-07-10 00:20:02.194
cmcwn9kbm01gntwsdgpoaruge	2025-07-09	1. Membantu melayani tamu yang datang ke kantor desa dengan sikap ramah dan sopan, serta mengarahkan sesuai keperluan mereka.\n2. Melakukan pengarsipan surat SKTM (Surat Keterangan Tidak Mampu) dengan menyusun dokumen berdasarkan urutan dan nama pemohon.\n3. Menyusun buku-buku bantuan dari perpustakaan yang diterima pada tanggal 8 Juli 2025 ke dalam rak, yang mayoritas berisi buku cerita anak-anak seperti legenda, mitos, dan cerita rakyat.\n4. Mencatat daftar buku berdasarkan:\n– Tanggal diterima\n– Nomor indeks\n– Judul buku\n– Keterangan buku	https://drive.google.com/drive/folders/1plm-CNfRf6-HgoJ7CReIv-rTpKbeI47X	cmc46q5ev005jtwlkm0nl2m8g	2025-07-10 00:23:13.186	2025-07-10 00:23:13.186
cmcvpmfaz01d1twsdbixb664t	2025-07-09	Membantu mempersiapkan rapat		cmc46sneu00eetwlk7gnrmbf8	2025-07-09 08:41:26.267	2025-07-10 00:54:14.796
cmcwpfl3e01h1twsdaude3a1w	2025-07-09	mengikuti konfirmasi penagihan dan menggandakan berkas	https://drive.google.com/drive/folders/1UBBCCvmPFW_sa4Fqoc7idNPddW7aN_78	cmc46sl0j00e7twlkracec5rj	2025-07-10 01:23:53.354	2025-07-10 01:23:53.354
cmcwpghat01h3twsd6ll1b9v1	2025-07-08	menginput ketetapan pajak reklame jatuh tempo 		cmc46sl0j00e7twlkracec5rj	2025-07-10 01:24:35.093	2025-07-10 01:24:35.093
cmcwthjj001hrtwsd6lik2e7b	2025-07-10	1. angkat solar \n2. bersihikan dalaman mobil Hino\n3. isi solar		cmc46pghq0029twlka9885aqa	2025-07-10 03:17:23.1	2025-07-10 03:17:23.1
cmcwthnyd01httwsdk7mf5o8d	2025-07-10	kegiatan saya pada hari ini membantu membersihkan mobil dan mengantar alat\n berat kemudiaan saya mengangkat solar, lalu saya membantu mengisi solat ke dalam mobil		cmc46pc16001ltwlkd7477efh	2025-07-10 03:17:28.837	2025-07-10 03:17:28.837
cmcwumlgw01hvtwsd19y9cz9p	2025-07-10	Hari ini kegiatan saya iya kah memindah kan eksaa dari pasar baru ke depan aman ppu		cmc46pl8k002xtwlkrv1parfp	2025-07-10 03:49:18.513	2025-07-10 03:49:18.513
cmcwwv6k301hxtwsd31wi0xdz	2025-07-10	perkenalan diri mengisi formulir nasabah	bergabung dengan orang orang tertentu	cmc46pfw20026twlkeuha5zir	2025-07-10 04:51:58.289	2025-07-10 04:51:58.289
cmcwx72mo01hztwsdzel8gmp0	2025-07-10	perkenalkan diri membuat rekening livin	belajar yang dikasih arahan	cmc46pm0s0032twlkvihkm06d	2025-07-10 05:01:13.104	2025-07-10 05:01:13.104
cmcwyalqm01i1twsdexnebr56	2025-07-10	Menginput data dan fto kopy		cmc46pjq9002ptwlkdlsbonh2	2025-07-10 05:31:57.454	2025-07-10 05:31:57.454
cmcwybkj101i3twsdm9ddi0qz	2025-07-10	Ngeinput data dan foto copy berkas		cmc46pmrj0035twlkiohdnxpz	2025-07-10 05:32:42.541	2025-07-10 05:32:42.541
cmcwze0bw01i5twsdrbgsom6n	2025-07-10	Hari ini tidak terlalu banyak kerjaan hanya mencatat disposisi undangan,dewan dan sekretariat,serta mengcopy berkas untuk di arsipkan		cmc46p6jo000ttwlkjoqzjw5q	2025-07-10 06:02:35.948	2025-07-10 06:02:35.948
cmcx0pw2q01i7twsdoj0hfxvj	2025-07-10	-meng input data bulan pernikahan di tahun 2023\n-mengeprint nama² bulan dri januari smpai Desember\n-menata semua data pernikahan dari januari hingga Desember tahun 2023	https://drive.google.com/drive/folders/13Mp9-xA1Ze02oHQIosYptt09VqyJrIdh	cmc46qufe007xtwlk6y6ld8k6	2025-07-10 06:39:49.922	2025-07-10 06:39:49.922
cmcx0uqdl01i9twsdntsx3gc4	2025-07-10	hari ini saya hanya mengantarkan surat surat keruangan kabid capil dan ke meja loket		cmc46qj48006wtwlkxjg53s62	2025-07-10 06:43:35.817	2025-07-10 06:43:35.817
cmcx0yqd301ibtwsdywhsas21	2025-07-10	hari ini saya membantu men upload data	https://drive.google.com/drive/folders/1dC1AoBtjsHd_JFJ9jHtmdZjyd06q6ED5	cmc46r3af008utwlkutramzmy	2025-07-10 06:46:42.424	2025-07-10 06:46:42.424
cmcx17h3o01idtwsdvoa6xlgj	2025-07-10	Membantu pelayanan penerbitan surat keputusan kepolisian (SKCK) 	https://drive.google.com/file/d/1-RvSulC5Ce5pvKcU4c3kHvq8zSYMUyFi/view?usp=drivesdk	cmc46p9dx0019twlk90er4978	2025-07-10 06:53:30.325	2025-07-10 06:53:30.325
cmcx1v0rc01ihtwsdn3fku37l	2025-07-10	menulis disposisi dan mengantar kan ke staf atasan,dan meminta tanda tangan		cmc46pdme001utwlksga35tj7	2025-07-10 07:11:48.888	2025-07-10 07:11:48.888
cmcx29u6001iltwsdrz8hy3ej	2025-07-10	Kegiatan saya hari ini,adalah menyapu, mencuci piring dan mensecen data data belanja	https://drive.google.com/file/d/1VnzymCye-6btNksp6RNhUhtvZz2eCHFy/view?usp=drivesdk	cmc46p5ql000ntwlkqrw64rf6	2025-07-10 07:23:20.184	2025-07-10 07:23:20.184
cmcx4ngjp01jrtwsd54g4hj6l	2025-07-10	Kegiatan yang saya lakukan hari ini\n- Disposisi surat masuk\n- Membuat surat cuti\n- Menjaga buku absen saat rapat	ga ada yang potoin	cmc46qyuo008gtwlkpfrhsk5a	2025-07-10 08:29:54.949	2025-07-10 08:29:54.949
cmcx302ed01iptwsd5h4y8c0x	2025-07-10	kegiatan hari ini ngescan data belanja kantor desa	https://drive.google.com/file/d/1J7b377yq57hn1t8J5jkjnVK6gLnQ-n3n/view?usp=drivesdk	cmc46poab003dtwlkkkqtlmi4	2025-07-10 07:43:43.91	2025-07-10 07:43:43.91
cmcx1bi6101iftwsdzqlfvzut	2025-07-10	di mulai dari pagi nyapu, lalu scen data data belanja kantor desa di tahun 2023,dan menyalin data ke buku 	https://drive.google.com/file/d/12s5qq2Jmp1lzNrfuVfoNUtJx5DmI6EWD/view?usp=drivesdk	cmc46pwha004itwlkuzsyazgn	2025-07-10 06:56:38.33	2025-07-10 07:44:01.562
cmcx368xc01ixtwsdimhqicyq	2025-07-10	membuat surat permohonan seleksi paskib		cmc46qwna0089twlkok4h7czv	2025-07-10 07:48:32.305	2025-07-10 07:48:32.305
cmcogkeyy00kxtwsd2gn940mx	2025-07-04	– Mengantarkan surat dan meminta sk, kepada mas Fadli \n– Mengantarkan surat dan meminta tanda tangan, kepada ibu Sri peni\n– Membawakan surat, dari ibu Jannah\n– Mengambilkan surat dan kertas hvs, dari mba Hijra		cmc46ryle00bztwlkx7awij04	2025-07-04 06:53:32.747	2025-07-10 07:50:34.173
cmcx398k301iztwsdp9cq3xwk	2025-07-10	- ngantar dan ngambil berkas ke bu hikmah\n- foto copy berkas²\n- mengisi arsip surat masuk\n- minta tanda tangan dan ngantar surat masuk ke bidang dikdas		cmc46siu100e0twlksoir3qyk	2025-07-10 07:50:51.796	2025-07-10 07:50:51.796
cmcst5hns00t7twsdjsdcctjo	2025-07-07	– Photocopy 200+ lembar dokumen\n– Photocopy 3 lembar surat dinas\n– Mengantarkan surat ke kabid\n		cmc46ryle00bztwlkx7awij04	2025-07-07 07:56:56.071	2025-07-10 07:53:04.14
cmcx35kwu01ivtwsd468h6igh	2025-07-10	– Photocopy berkas\n– Photocopy berkas part 2\n– Photocopy berkas part 3\n– Mengantarkan surat dan meminta nomor sk		cmc46ryle00bztwlkx7awij04	2025-07-10 07:48:01.182	2025-07-10 07:54:18.061
cmcx3fl5301j1twsdrn4smw47	2025-07-10	menyusun dokumen, membuat surat permohonan untuk seleksi  dan pelatih paskibra Hut ri ke 80 kecamatan Babulu, dan menulis buku regalisasi 		cmc46qlb20073twlkwsk9yxzh	2025-07-10 07:55:48.039	2025-07-10 07:55:48.039
cmcx3imv901j5twsd7036wywk	2025-07-10	pendaftaran pbb,mencetakan		cmc46qc9w0067twlkcuynnxtk	2025-07-10 07:58:10.245	2025-07-10 07:58:10.245
cmcx3lkra01jbtwsdulh1edh6	2025-07-10	kegiatan hari ini membersihkan kantor, mencetak dan menyusun laporan tutup buku dari transaksi harian.	https://drive.google.com/file/d/1Y-k8EmxJQaXY-ReSIqcA5cF86N5Ivlrq/view?usp=drivesdk	cmc46rcbv009rtwlkrdwu5dht	2025-07-10 08:00:27.479	2025-07-10 08:00:45.903
cmcx3mso101jdtwsdocbhye3s	2025-07-10	kegiatan hari ini :\n1. membakar sampah \n2. menyusun laporan harian \n3. belajar cara print laporan tutup buku	https://drive.google.com/file/d/14rA-ia0oISCqyRR_JfCUzfI9P1DjQYZn/view?usp=drivesdk	cmc46q9ut005xtwlkhtlk8doe	2025-07-10 08:01:24.385	2025-07-10 08:01:24.385
cmcx3njjd01jhtwsd47zweu7d	2025-07-10	Hari ini kurang kerjaan cuman dsuruh rakit bunga , temanin mbak kntor belanja		cmc46s31000cdtwlkt2zewnu5	2025-07-10 08:01:59.209	2025-07-10 08:01:59.209
cmcx3tqss01jntwsdrqfinjxe	2025-07-10	hari ini saya tidak banyak melakukan kegiatan\n- menghitung realisasi evaluasi renja\n- menyimpan dokumen	https://drive.google.com/drive/folders/13T7bq1XQE7e_cBszvcSEedw4giSPrMkM	cmc46sgjj00dttwlk2n9q1jja	2025-07-10 08:06:48.556	2025-07-10 08:06:48.556
cmcx464qp01jptwsd4omdc8n2	2025-07-10	kegiatan saya hari ini:\n1. mengecek slip penyetoran nasabah\n2. menyusun  data nasabah\n3. memprint cheking nasabah\n4. membuatkan formulir nasabah\n5. memasang matrai	https://drive.google.com/file/d/1NwQERDCFQFJQmrvat76Ps2lD3HbvFSg5/view?usp=drivesdk	cmc46p6zu000wtwlk8cv819k1	2025-07-10 08:16:26.497	2025-07-10 08:16:26.497
cmcx4q8s501jttwsd4mc2kyka	2025-07-10	-Apel pagi\n- Mengganti per truk yang patah	https://drive.google.com/file/d/14KqrKyHBGIJtofmXLcXhTAxjdROzVkYl/view?usp=drivesdk	cmc46t5kl00g8twlkurga8kks	2025-07-10 08:32:04.853	2025-07-10 08:32:04.853
cmcx4r7vl01jvtwsdyqke3u7d	2025-07-10	Pada hari ini saya menandain kata-kata penting disurat saya samapta RESPPU,lalu menulis satu persatu surat laporan itu ke buku penanda bahwa surat ini sudah mencakup hari dan tanggal dan memasukkan lembaran berkas masuk dan keluar.	https://drive.google.com/file/d/1SCDnJ2qqQPrnj9DXHNu48-0bQlPU1_MC/view?usp=drivesdk	cmc46pnhf003atwlk0zw4shj9	2025-07-10 08:32:50.337	2025-07-10 08:32:50.337
cmcx4udqi01jxtwsdlafc9w9v	2025-07-10	turun kelapangn buat penagihan pajak		cmc46r5k40091twlkc6d32ylm	2025-07-10 08:35:17.899	2025-07-10 08:35:17.899
cmcx4w7q501jztwsdema4c1cg	2025-07-10	kegiatan saya pada hari ini yaitu mendokumentasikan hasil pekerjaan pada hari ini		cmc46qs78007qtwlkv76qqm1t	2025-07-10 08:36:43.421	2025-07-10 08:36:43.421
cmcx5luiu01k7twsd68zm902v	2025-07-10	kegiatan pkl hari ini\n-mengganti Bering as roda+karet stabilizer\n-servis+ganti oli\n		cmc46uva300mftwlk0yfyi1q9	2025-07-10 08:56:39.332	2025-07-10 08:56:39.332
cmcx61c4n01kftwsdxnhlz8lr	2025-07-10	mencatat SKTM dan SK		cmc46ra3i009ktwlk4kxhy7zp	2025-07-10 09:08:42.023	2025-07-10 09:08:42.023
cmcx6t82o01khtwsd6q9vv3hl	2025-07-09	Day 7 PKL :\nMasih belajar pemasangan wifi bertipe kabel	https://drive.google.com/file/d/1-PPDkm7R-QNxAN4TiUvwtLt_r4jgATDB/view?usp=drivesdk	cmc46p64g000qtwlkv3exmjxb	2025-07-10 09:30:23.136	2025-07-10 09:30:23.136
cmcx6tdwj01kjtwsdrjseovmy	2025-07-10	Ganti oli, tune up, servis rem		cmc46ubh400ketwlkkfu8nopc	2025-07-10 09:30:30.691	2025-07-10 09:30:30.691
cmcx6vixw01kltwsdhwxmnkjt	2025-07-10	Day 8 PKL :\nPencopotan pemancar wifi bertipe tiang	https://drive.google.com/file/d/1-WCTfcJwjpAfrLMVo9Xrmmj-_CdFUucf/view?usp=drivesdk	cmc46p64g000qtwlkv3exmjxb	2025-07-10 09:32:10.532	2025-07-10 09:32:54.478
cmcx7go5001kntwsdb8dg1b9a	2025-07-10	pasang besi teror bawah\ncek busi \nbagusin soket blower \n		cmc46t12y00fptwlkqbiheqi2	2025-07-10 09:48:37.045	2025-07-10 09:48:37.045
cmcx7i39p01kptwsd16vlph0d	2025-07-10	-ganti pul pam\n-ganti oli mesin dan transmisi \n-Ganti vabelt		cmc46uzp400mttwlk0oazh0s3	2025-07-10 09:49:43.31	2025-07-10 09:49:43.31
cmcx7n77u01krtwsd1sc84ywc	2025-07-10	- menginput data pasangan yang menikah di tahun 2023 (januari - desember )\n- nge print tanggal & tahun 2023 untuk tanda dokumen data psangan pengantin 2023\n- merapikan data pasangan yang menikah di tahun 2023 ke ruangan penyimpanan dokumen	https://drive.google.com/drive/folders/13Mp9-xA1Ze02oHQIosYptt09VqyJrIdh	cmc46qeik006etwlk22jwlw57	2025-07-10 09:53:41.707	2025-07-10 09:53:41.707
cmcx57co901k1twsdt893x2el	2025-07-09	Kegiatan saya dan mekanik saya, Menganti fulpam mesin besar,selain Menganti fulpam saya juga Menganti air radiator	https://drive.google.com/folderview?id=1rpaEVGzx0HQ6kBZCCWy42j8Na-Azsvri	cmc46ttvb00iotwlkamx55iuo	2025-07-10 08:45:23.049	2025-07-10 10:31:41.11
cmcx9a9wj01kttwsdniw8g1rc	2025-07-10	•menginput BPHTB\n•melayani pembayaran pajak BPHTB melalui qris\n		cmc46rwds00bstwlkvna2msl2	2025-07-10 10:39:37.891	2025-07-10 10:39:37.891
cmcx9lylb01kvtwsdqatb0ec5	2025-07-10	Kegiatan hari ini saya dan mekanik Menganti per ban mobil truk.	https://drive.google.com/folderview?id=1soWZb5kR-WpaftWO3dA7ZZ-k4Q0gz3vp	cmc46ttvb00iotwlkamx55iuo	2025-07-10 10:48:43.104	2025-07-10 10:48:43.104
cmcxa37jj01kxtwsd1m4ib2mm	2025-07-10	Hari ini saya Mencatat data pengangguran\nMaaf saya telat ngirim🙏🙏	https://drive.google.com/file/d/1KsXrcuqeSOUgP2umA8IsUMPfKozjzCLh/view?usp=drivesdk	cmc46rgo400a5twlk8xzlphlx	2025-07-10 11:02:07.855	2025-07-10 11:02:07.855
cmcxbivq301kztwsd18njlglt	2025-07-10	kegiatan saya harini mengganti busi dan kampas kopling mobil	https://drive.google.com/drive/folders/1dqK0ujwwH1UmW_kgTLCtcgYbuw2MuBpy	cmc46uopi00lutwlk6ky20hrv	2025-07-10 11:42:18.652	2025-07-10 11:42:18.652
cmcxbnz8c01l1twsd8x64dn6n	2025-07-10	yang saya kerjakan hari ini\n-menganti kampas rem belakang \n-menganti per shok\n-dan menganti kampas ganda		cmc46tiru00hktwlk85dmpfyh	2025-07-10 11:46:16.476	2025-07-10 11:46:16.476
cmcxbuqkn01l3twsdjmd9eip0	2025-07-10	1. Membantu melayani tamu yang datang ke kantor desa dengan ramah dan sopan, serta mengarahkan mereka sesuai keperluannya.\n2. Melanjutkan pencatatan daftar buku bantuan dari perpustakaan, yang berisi data seperti tanggal diterima, nomor indeks, judul buku, dan keterangan buku, guna melengkapi data buku yang telah disusun sebelumnya di rak.		cmc46q5ev005jtwlkm0nl2m8g	2025-07-10 11:51:31.847	2025-07-10 11:51:31.847
cmcxcmbup01l5twsd4k6smyll	2025-07-10	Hari ini saya melakukan meganti oli mesin, dan filter oli filter, udara dan pengecekan tayming mobil		cmc46v8mu00nrtwlkm3c62zp1	2025-07-10 12:12:59.137	2025-07-10 12:12:59.137
cmcxgacac01l7twsda138wqms	2025-07-10	saya masih melanjutkan tugas membuat aplikasi crud bertema sewa mobil 		cmc46putt0049twlkz0v03scf	2025-07-10 13:55:38.293	2025-07-10 13:55:38.293
cmcxhssnf01l9twsdoyj17fbs	2025-07-10	Bantu mengangkut barang + cara membersihkan laptop 		cmc46psei003xtwlkve7bkjpy	2025-07-10 14:37:58.923	2025-07-10 14:37:58.923
cmcxicf5m01lbtwsd1v2tfnuy	2025-07-10	Belajar mengubah file word ke pdf secara online memakai link ini  (https://www.adobe.com/acrobat/online/word-to-pdf.html)		cmc46pp3s003htwlkl4no5tkd	2025-07-10 14:53:14.554	2025-07-10 14:53:53.782
cmcxikftj01ldtwsdr55d1uz5	2025-07-10	-ganti shock BMW\n-cari top cevrolet 		cmc46udog00kltwlk8mp3jpsw	2025-07-10 14:59:28.663	2025-07-10 14:59:28.663
cmcxyznm101lftwsdov2nsbus	2025-07-09	menyusun laporan kinerja perkecamatan yang ada di ppu tahun 2024-2025		cmc46pt0l0041twlk75hwckll	2025-07-10 22:39:12.452	2025-07-10 22:39:12.452
cmcxz0omb01lhtwsdgltspmpu	2025-07-10	menyusun laporan kinerja sekecamatan. yang ada di ppu tahun 2023		cmc46pt0l0041twlk75hwckll	2025-07-10 22:40:00.419	2025-07-10 22:40:00.419
cmcy1y08601n3twsd731c371l	2025-07-08	saya mengetik kuesioner di excel, untuk di jadikan laporan. saya juga mengantarkan surat bidang bidang. 	https://drive.google.com/drive/folders/1ElihpgsucgKeKf_9-9zaK2r20RCrdEHg	cmc46s9u700d3twlkxxrzmirt	2025-07-11 00:01:54.342	2025-07-11 00:02:09.376
cmcy57bvv01nztwsdl5vixi64	2025-07-11	Sedang mengadakan kerja bakti di jalan pasar baru	https://drive.google.com/file/d/1FZKeANMOs9MYR9FJBN1lNEsJ82sZNahy/view?usp=drivesdk	cmc46pf530021twlkuuodzcss	2025-07-11 01:33:08.203	2025-07-11 01:33:08.203
cmcy5gt6301o1twsdp17t1hro	2025-07-11	kegiatan bersih' di pasar baru bersama org' kantor camat dan kantorr desaaa babulu 	https://drive.google.com/file/d/1OvvLh-gblRE5wUXSZnOuxU1twU3I3Mau/view?usp=drivesdk	cmc46px46004ltwlkbeei43ix	2025-07-11 01:40:30.508	2025-07-11 01:40:30.508
cmcy7v4eg01obtwsd3qftkrtv	2025-07-11	Jumat pagi saya mengikuti jalan santai bersama anggota dprd,kemudian saya mengerjakan surat masuk disposisi dan di serahkan kepada ketua dprd 		cmc46p6jo000ttwlkjoqzjw5q	2025-07-11 02:47:37.48	2025-07-11 02:47:37.48
cmcy81qvp01odtwsd7ful7ckp	2025-07-11	yasinan bersama, mengisi formulir nasabah yang ingin mengajukan kredit, mengantar berkas	membantu menyajikan makanan di dapur	cmc46pfw20026twlkeuha5zir	2025-07-11 02:52:46.549	2025-07-11 02:52:46.549
cmcy9b70g01oftwsd4flsu918	2025-07-11	kegiatan hari ini\n1. bersih bersih \n2. print laporan harian	https://drive.google.com/file/d/1566Ifgkchmmjtual1LVHD-PBQQ-3QGb0/view?usp=drivesdk	cmc46q9ut005xtwlkhtlk8doe	2025-07-11 03:28:06.976	2025-07-11 03:28:06.976
cmcyay0rx01ohtwsd9qabprjx	2025-07-11	Belajar membuat surat keluar di E-OFFICE penajam link (https://eoffice.penajamkab.go.id/login)	https://drive.google.com/file/d/1TVgaqnNvL_5a6Eq3jWN8jtjt2hangETi/view?usp=drivesdk	cmc46pp3s003htwlkl4no5tkd	2025-07-11 04:13:51.598	2025-07-11 04:15:54.19
cmcyb4oun01ojtwsdm8ojvqkn	2025-07-11	-meng input data nama wali nikah 	https://drive.google.com/drive/folders/1418ss3nx7ezol9QaXa2rNf6KaXRr_jZf	cmc46qufe007xtwlk6y6ld8k6	2025-07-11 04:19:02.736	2025-07-11 04:19:02.736
cmcyb5uol01oltwsdhlnysrhg	2025-07-11	Bersih-bersih baru lanjut Membantu pelayanan penerbitan surat keputusan kepolisian (SKCK)		cmc46p9dx0019twlk90er4978	2025-07-11 04:19:56.95	2025-07-11 04:19:56.95
cmcyb8poh01ontwsdlfy20oib	2025-07-11	kegiatan saya pada hari ini mengisi solarr dan mengangkat ke mobil dan membantu mengisi solat ke mobil		cmc46pc16001ltwlkd7477efh	2025-07-11 04:22:10.433	2025-07-11 04:22:10.433
cmcyb8qwh01optwsdegmtvn5k	2025-07-11	Kegiatan saya hari ini mengisi solar dan menahkat ny ke mobil dan mengantar untuk bahan bakar eksaa		cmc46pl8k002xtwlkrv1parfp	2025-07-11 04:22:12.017	2025-07-11 04:22:12.017
cmcydmxet01ovtwsdieifojev	2025-07-11	Kegiatan hari ini saya dan huda membersihkan alat-alatnya gardan.	https://drive.google.com/folderview?id=1tdEWTUkc2neepwcP0W4szixbCZvjfsI4	cmc46ttvb00iotwlkamx55iuo	2025-07-11 05:29:12.87	2025-07-11 05:29:12.87
cmcydn7zq01oxtwsdnefnston	2025-07-11	mengisi solar dan mengangkat jerigen solar ke mobil		cmc46pghq0029twlka9885aqa	2025-07-11 05:29:26.582	2025-07-11 05:29:26.582
cmcyfbyvy01p1twsdbula5vm1	2025-07-11	- meng input data saksi dan penghulu pasangan yang menikah di bulan juni	https://drive.google.com/drive/folders/1418ss3nx7ezol9QaXa2rNf6KaXRr_jZf	cmc46qeik006etwlk22jwlw57	2025-07-11 06:16:40.798	2025-07-11 06:16:40.798
cmcyfegu101p3twsdvc00swnl	2025-07-10	 kegiatan saya membuat riwayat perencanaan masuk		cmc46pq1s003ltwlkhuevqi62	2025-07-11 06:18:37.369	2025-07-11 06:18:37.369
cmcyfn07r01p5twsdxbkd578t	2025-07-11	pendaftaran pbb 		cmc46qc9w0067twlkcuynnxtk	2025-07-11 06:25:15.736	2025-07-11 06:25:15.736
cmcygkwue01pjtwsd5qnpe8zm	2025-07-11	Kegiatan hari ini hanya membuat surat		cmc46pctz001ptwlko6va5kot	2025-07-11 06:51:37.671	2025-07-11 06:51:37.671
cmcygl74z01pltwsdbon5fq1g	2025-07-11	hari ini kegiatan saya membuat surat		cmc46pi7s002htwlk9tebi51u	2025-07-11 06:51:51.011	2025-07-11 06:51:51.011
cmcygr95i01pxtwsdwun4xzuw	2025-07-11	hari ini saya membantu proses digitalisasi surat resmi di kantor desa, tepatnya dokumen surat keterangan. proses dimulai dengan memotret surat menggunakan kamera ponsel, kemudian dilakukan pengecekan hasil gambar agar jelas dan tidak blur.\n\nsetelah dipastikan jelas, foto dokumen disimpan atau diubah menjadi file PDF\n\ntujuan kegiatan ini adalah untuk menyimpan salinan digital sebagai cadangan dan mempermudah distribusi dokumen secara online.	https://drive.google.com/file/d/1wBnfUzQJndtBu0fIDEt6QD8t46q3Z3L7/view?usp=drivesdk	cmc46pkez002ttwlknaeob0ip	2025-07-11 06:56:33.559	2025-07-11 06:56:33.559
cmcygsaui01pztwsdkzjl4wkf	2025-07-11	Melipat kertas undangan kepala desa		cmc46rixs00aitwlkpg86h565	2025-07-11 06:57:22.41	2025-07-11 06:57:22.41
cmcygtme401q1twsdxeuylpyu	2025-07-11	Kegiatan hari ini melipat kertas undangan		cmc46phg0002dtwlkt8tcx2ia	2025-07-11 06:58:24.028	2025-07-11 06:58:24.028
cmcyg9gua01pdtwsd7ma5ul2u	2025-07-11	Kegiatan saya hari ini dari susun bukti transfer dan lipat surat undangan kantor desa\n		cmc46seaw00dhtwlknxsz3ms1	2025-07-11 06:42:43.68	2025-07-11 06:59:13.296
cmcygvlsy01q5twsdu5v04mrm	2025-07-11	mencatat data daftar kepala sekolah yang habis tmt sk di lingkungan disdikpora		cmc46siu100e0twlksoir3qyk	2025-07-11 06:59:56.578	2025-07-11 06:59:56.578
cmcygwi4d01qdtwsd4a0hwouw	2025-07-11	kegiatan hari ini memfoto berkas dan dijadikan pdf,dan membantu melipat undangan kantor, 	https://drive.google.com/file/d/1I8T-l05m16aKfwzfoFRBVfq7TGBKl6hH/view?usp=drivesdk	cmc46ped8001ytwlkfrb06txj	2025-07-11 07:00:38.461	2025-07-11 07:00:38.461
cmcygxq5j01qltwsd7la1isj2	2025-07-11	kegiatan saya hari ini yaitu gotong royong di, bersih² rumah makan gratis, dan membantu membagikan makan gratis		cmc46qs78007qtwlkv76qqm1t	2025-07-11 07:01:35.528	2025-07-11 07:01:35.528
cmcygxuyz01qntwsd9jj0lcqb	2025-07-11	kegiatan saya hari ini adalah gotong royong, membersihkan rumah makan gratis, melakukan dokumentasi, dan meminta nomor surat pengantar.		cmc46q7m6005qtwlksgmx27n4	2025-07-11 07:01:41.772	2025-07-11 07:01:41.772
cmcygyco901qptwsdkjt3fi6l	2025-07-11	bergotong royong di jalan pasar baru babulu darat 		cmc46qwna0089twlkok4h7czv	2025-07-11 07:02:04.714	2025-07-11 07:02:04.714
cmcyh2t8101r1twsdmc0zgfio	2025-07-11	kegiatan saya hari ini yaitu gotong royong di pasar babulu, bersih² rumah makan gratis, dan membantu membagikan makan gratis	https://drive.google.com/file/d/1F-KD2aJW_AOS17yc-9bFFvoDxkQzVVaK/view?usp=drivesdk	cmc46qlb20073twlkwsk9yxzh	2025-07-11 07:05:32.785	2025-07-11 07:05:32.785
cmcyhaiv101r9twsdp6bpnjek	2025-07-11	Bikin laporan bpjs kesehatan		cmc46rpmn00b3twlk3kcu7mik	2025-07-11 07:11:32.605	2025-07-11 07:11:32.605
cmcyhi2hz01rbtwsdp94in4p8	2025-07-11	1. Membantu melayani tamu yang datang untuk menghadiri rapat OJT (On The Job Training) terkait administrasi dan tata naskah desa Labangka, Kecamatan Babulu. Kegiatan ini meliputi pembagian daftar absensi kepada peserta yang hadir, serta membagikan makanan ringan untuk sarapan dan makan siang.\n2. Ikut serta mengamati jalannya kegiatan acara, guna memahami proses pelaksanaan OJT dan tata cara penyelenggaraan rapat di lingkungan pemerintahan desa.	https://drive.google.com/drive/folders/1qYg7uuZboiE5s7ifIdRPGb-Sxajdmmim	cmc46q5ev005jtwlkm0nl2m8g	2025-07-11 07:17:24.648	2025-07-11 07:17:24.648
cmcyhj8fd01rftwsdrlh94dfl	2025-07-11	kegiatan Jumat hari ini pagi gotong royong membersihkan jalan pasar baru,lalu lanjut scan belanja kantor desa babulu darat\n	https://drive.google.com/file/d/1RsnA3NiM0r1WU-YSRbMUzzsPq37stCNL/view?usp=drivesdk\n\nhttps://drive.google.com/file/d/1-nEfkNgLh2WLvh7EKlsstpyrr1AmfLEw/view?usp=drivesdk	cmc46poab003dtwlkkkqtlmi4	2025-07-11 07:18:18.955	2025-07-11 07:18:18.955
cmcyht0mc01rntwsde7szulop	2025-07-11	hari ini saya tidak banyak melakukan pekerjaan\nmemindahkan hasil uang pagu dan realisasi nya ke dokumen	https://drive.google.com/drive/folders/14518TU3TWVJRmo-TjQQKTRO_j8EgpblL	cmc46sgjj00dttwlk2n9q1jja	2025-07-11 07:25:55.429	2025-07-11 07:25:55.429
cmcyhld6z01rltwsdrf5hvodc	2025-07-11	Kegiatan hari ini	https://drive.google.com/file/d/1LRzNv7LC9xKiWeQOD2edJzMAgIRNjmNa/view?usp=drivesdk	cmc46rgo400a5twlk8xzlphlx	2025-07-11 07:19:58.475	2025-07-11 07:26:26.386
cmcyhvj4p01rrtwsdrb11wbtk	2025-07-11	Gotong royong, menyapu, scen data SPJ, memilah bantuan BPJS 	https://drive.google.com/file/d/1WhrxePug25GET7-LmvAzgOML7iOEMfrj/view?usp=drivesdk	cmc46p5ql000ntwlkqrw64rf6	2025-07-11 07:27:52.729	2025-07-11 07:27:52.729
cmcyhvbjt01rptwsdvz9m70xg	2025-07-11	gotong royong, nyapu, sken data spj, memilah bantuan bpjs ketenagakerjaan. 	https://drive.google.com/file/d/13Bef_rcCoa3QWZtpt8OadYlkfnJq97SN/view?usp=drivesdk	cmc46pwha004itwlkuzsyazgn	2025-07-11 07:27:42.905	2025-07-11 07:29:16.995
cmcyhzp3y01rxtwsd7z4hh7hd	2025-07-11	Melaksanakan jalan sehat bersama		cmc46pjq9002ptwlkdlsbonh2	2025-07-11 07:31:07.103	2025-07-11 07:31:07.103
cmcyisfx401s1twsdcvhmll4s	2025-07-11	Gotong royong membersihkan pasar dan sekitarnya \nDan di suruh membuat daftar nama-nama pengangguran tahun 2025	https://drive.google.com/file/d/1Cg_n_BRCLFHvfE9Hh3J8xFosWO4fEKMK/view?usp=drivesdk	cmc46p7y00012twlkan1t901y	2025-07-11 07:53:28.217	2025-07-11 07:53:28.217
cmcyjf3xs01s5twsdqf2gizuu	2025-07-11	Kegiatan yang saya lakukan hari ini\n- Gotong royong bersama desa" yang lain\n- Mendisposisikan surat masuk\n- Membantu mempersiapkan makan gratis 	https://drive.google.com/file/d/1lU-i_e1UCFR9nkFOfI51dqBxk_TxW9QS/view?usp=drivesdk	cmc46qyuo008gtwlkpfrhsk5a	2025-07-11 08:11:05.777	2025-07-11 08:11:05.777
cmcyjfvwr01s7twsdaffunqlq	2025-07-11	Mengikuti jalan sehat		cmc46pmrj0035twlkiohdnxpz	2025-07-11 08:11:42.027	2025-07-11 08:11:42.027
cmcyjyohz01sbtwsdpjfxl145	2025-07-11	kegiatan saya hari ini:\n1. menyusun formulir nasabah\n2. mengecek laporan teller\n3. menyusun jaminan nasabah\n4. menyimpan jaminan nasabah\n5. mengubah nama akuntansi Txt harian\n6. masak"	https://drive.google.com/file/d/1nLuLEbwF_BrI5G741q9DDj8YYovXkNgR/view?usp=drivesdk	cmc46p6zu000wtwlk8cv819k1	2025-07-11 08:26:18.887	2025-07-11 08:26:18.887
cmcyk0hsh01sdtwsd508kf7a8	2025-07-11	Kegiatan hari ini masih bikin proposal 		cmc46q2rq005atwlks6oghu8m	2025-07-11 08:27:43.505	2025-07-11 08:27:43.505
cmcykwvpe01sltwsd5mzkbhra	2025-07-11	Melengkapi data saksi pada data pengantin		cmc46qpxp007jtwlkmf7x9mjw	2025-07-11 08:52:54.53	2025-07-11 08:52:54.53
cmcylxerp01srtwsdt0mfehvr	2025-07-11	- Apel pagi\n- Membersihkan bagian komponen gardan truk\n- Memasang pengereman rem belakang, seperti kampas, piston rem dan lain lain	https://drive.google.com/file/d/14XpsxCHB1k-U7SY2CVS7TxmG3_4QdY9G/view?usp=drivesdk	cmc46t5kl00g8twlkurga8kks	2025-07-11 09:21:18.853	2025-07-11 09:21:18.853
cmcyoapnk01sttwsdp4hzppp2	2025-07-11	Kegiatan hari ini gotong royong dan bersih bersih	https://drive.google.com/file/d/1zgOmqDi_UVLKcv3w8Ds8NypXH1xlH_Uv/view?usp=drivesdk	cmc46qgrp006ltwlkgmd3zvcp	2025-07-11 10:27:38.721	2025-07-11 10:27:38.721
cmcyoem7t01svtwsdgfnv07io	2025-07-11	ikut berpartisipasi dalam acara kegiatan OJT (One The Job Training)		cmc46ra3i009ktwlk4kxhy7zp	2025-07-11 10:30:40.889	2025-07-11 10:30:40.889
cmcyq44tf01sxtwsdlapguzbn	2025-07-11	-ganti oli mesin\n-ganti oli gardan\n		cmc46udog00kltwlk8mp3jpsw	2025-07-11 11:18:31.011	2025-07-11 11:18:31.011
cmcyq6mwd01sztwsdm2qdy86r	2025-07-11	Meminta tanda tangan ke kantor pusat		cmc46sneu00eetwlk7gnrmbf8	2025-07-11 11:20:27.758	2025-07-11 11:20:27.758
cmcyqlo1601t1twsdhfmtvrm5	2025-07-11	bang hari ini saya lupa absen maafkan saya. kegiatan hari ini \n1.gotong royong di Pasbar \n2.melayani ahli waris\n3.membantu rapat bpjs-beasiswa\n4.membantu buat makan gratis 	https://drive.google.com/file/d/13KJEimE91o8GfMGtZI0BnBXN2iasVXnj/view?usp=drivesdk	cmc46rndz00awtwlkmxzfjiix	2025-07-11 11:32:09.067	2025-07-11 11:32:09.067
cmcysiu2i01t3twsdbjb5xykz	2025-07-11	Ganti oli, tune up, service rem		cmc46ubh400ketwlkkfu8nopc	2025-07-11 12:25:56.121	2025-07-11 12:25:56.121
cmcyskqw101t5twsdl4xkuoad	2025-07-11	Hari ini saya mengerjakan tugas sambil belajar menyalin,mencetak dengan printer,mengeklip lembaran kertas dan memasukinya dimap kuning laporan dari sat samapta dll.	https://drive.google.com/file/d/1CBDtNwP6zgsBDZtVE8VmgJnrJ19iXIiY/view?usp=drivesdk	cmc46pnhf003atwlk0zw4shj9	2025-07-11 12:27:25.345	2025-07-11 12:27:25.345
cmcyswo7x01t7twsd4act6w93	2025-07-11	men desain yang di canva buat presentasi, lalu mengerjakan data data yang perlu di perbaiki dan di print.	https://drive.google.com/file/d/1XrEn9GkGiPc70ocQkUWAXGsaluDHYXlK/view?usp=drivesdk	cmc46s59s00cqtwlkc8385tg3	2025-07-11 12:36:41.757	2025-07-11 12:36:41.757
cmcyt10zk01t9twsdenffp2fp	2025-07-11	Rabu, 9 Juli 2025\nkegiatan : saya menulis hasil kuesioner yang telah di lakukan di hari selasa, meminta ttd pak kadis dan persetujuan, mengantarkan surat ke bidang bidang lain. \n\nkamis, 10 Juli 2025\nkegiatan kegiatan saya masih sama seperti m hari sebelumnya yaitu mengetik hasil kuesioner.\n\nJum'at, 11 Juli 2025\nkegiatan : dihari ini saya tidak terlalu berkegiatan karena tidak terlalu banyak tugas masuk, saya hanya mengetik beberapa kuesioner dan mengantarkan surat. 	https://drive.google.com/drive/folders/1ElihpgsucgKeKf_9-9zaK2r20RCrdEHg	cmc46s9u700d3twlkxxrzmirt	2025-07-11 12:40:04.929	2025-07-11 12:40:23.411
cmcyvar1j01tbtwsdf5basabc	2025-07-11	Kegiatan hari ini membersihkan kantor dan halaman kantor, dan mencetak tutup buku laporan harian.	https://drive.google.com/file/d/1YGr4t4TuKu7hjJtLcU21LEm4su3BMpOt/view?usp=drivesdk	cmc46rcbv009rtwlkrdwu5dht	2025-07-11 13:43:37.831	2025-07-11 13:44:14.885
cmcyyrn7x01tdtwsd1d2p17ei	2025-07-11	Day 9 PKL :\nIkut pememasang kabel nikeroti	https://drive.google.com/drive/folders/1-6Sua6unCx7OLWj5Oioyb8puA1Iiquu9 	cmc46p64g000qtwlkv3exmjxb	2025-07-11 15:20:44.877	2025-07-11 15:22:17.004
cmczn3z8j01tttwsd15b8az53	2025-07-11	kegiatan saya\n- membongkar transmisi mobil\n- mengganti seal oli mobil truck\n- mengganti krek and mobil	https://drive.google.com/drive/folders/1dqK0ujwwH1UmW_kgTLCtcgYbuw2MuBpy	cmc46uopi00lutwlk6ky20hrv	2025-07-12 02:42:11.076	2025-07-12 02:42:11.076
cmd001qzm01u1twsd56v5fokn	2025-07-12	-tun up\n-ganti oli\n-ganti Shok belakang.\n-ganti waterpam		cmc46uzp400mttwlk0oazh0s3	2025-07-12 08:44:22.115	2025-07-12 08:44:22.115
cmd01f1kj01u5twsduump00lk	2025-07-12	- Apel pagi\n- Memperbaiki kebocoran seal piston rem mobil thunder\n- Gotong royong membersihkan bengkel	https://drive.google.com/file/d/14oZJkZ8gYrCeXvr_ifG-4ugqI0F26MSF/view?usp=drivesdk	cmc46t5kl00g8twlkurga8kks	2025-07-12 09:22:41.971	2025-07-12 09:22:41.971
cmd09nczm01u7twsd811leyym	2025-07-12	Tune up, ganti oli		cmc46ubh400ketwlkkfu8nopc	2025-07-12 13:13:06.946	2025-07-12 13:13:06.946
\.


--
-- Data for Name: setting_absensis; Type: TABLE DATA; Schema: public; Owner: jurnal_user
--

COPY public.setting_absensis (id, "modeAbsensi", "tempatPklId", "createdAt", "updatedAt") FROM stdin;
cmbke16l40003tw5005rmtvyt	MASUK_PULANG	tempat2	2025-06-06 05:51:49.145	2025-06-06 05:51:49.145
cmcbnw64w00oatwlk8a098xn8	MASUK_PULANG	cmc48rtmy00o1twlk3uhabwd0	2025-06-25 07:57:38.141	2025-06-25 07:57:38.141
cmcbo7n6v00oitwlk2b7q4xuk	MASUK_PULANG	cmca53cvo00o5twlke9erzxzp	2025-06-25 08:06:33.511	2025-06-25 08:06:33.511
cmcbovd9400ootwlk7rtkt4sg	MASUK_PULANG	cmca53uno00o7twlkyp4pdtpz	2025-06-25 08:25:00.376	2025-06-25 08:25:00.376
cmcliycs7004ltwsdz0v54v5h	MASUK_PULANG	cmck41lu4001gtwsdh9n41hyu	2025-07-02 05:37:03.799	2025-07-02 05:37:03.799
cmclo1bu90069twsdgzu7bnhi	MASUK_PULANG	cmck3zuvk0010twsdkc3xecuu	2025-07-02 07:59:20.625	2025-07-02 07:59:20.625
cmcmkfn02008dtwsdqs3matqv	MASUK_PULANG	cmck401eu0012twsds1qwqjw4	2025-07-02 23:06:15.987	2025-07-02 23:06:15.987
cmcmky8ka008ntwsdfk6yzind	MASUK_PULANG	cmck3xw5t000qtwsdwrv2o0ua	2025-07-02 23:20:43.738	2025-07-02 23:20:43.738
cmcmljlps0097twsdsqp3ora8	MASUK_PULANG	cmck413cb001ctwsddb4r6abm	2025-07-02 23:37:20.56	2025-07-02 23:37:20.56
cmcmlnsfw009dtwsdv95p5kob	MASUK_PULANG	cmck0qlgg0008twsdeysp7xwp	2025-07-02 23:40:35.901	2025-07-02 23:40:35.901
cmcmmj4ol009ptwsdzbu72wxv	MASUK_PULANG	cmck0tens000atwsdmwj9xk2w	2025-07-03 00:04:58.102	2025-07-03 00:04:58.102
cmcmmouq300a1twsds95y205a	MASUK_PULANG	cmck44fxi0022twsdqewf2qfz	2025-07-03 00:09:25.132	2025-07-03 00:09:25.132
cmcmmsfru00a5twsdccvkgyzk	MASUK_PULANG	cmck40cr50016twsdir1pcyun	2025-07-03 00:12:12.379	2025-07-03 00:12:12.379
cmcmnq20m00adtwsddmso3hlb	MASUK_PULANG	cmc48mqk900nxtwlkpuu6o5zz	2025-07-03 00:38:20.854	2025-07-03 00:38:20.854
cmcmnutyv00aptwsdqm4x7hal	MASUK_PULANG	cmck58yj9002itwsdcqhqroi1	2025-07-03 00:42:03.703	2025-07-03 00:42:03.703
cmcmohr3w00b9twsdkqsjvxz8	MASUK_PULANG	cmck435iu001stwsdbk5h55wi	2025-07-03 00:59:53.084	2025-07-03 00:59:53.084
cmcmoyh3r00bdtwsduwqlq5r6	MASUK_PULANG	cmck42pk6001otwsdlv11onid	2025-07-03 01:12:53.272	2025-07-03 01:12:53.272
cmcmp4ydr00bltwsd1n4km15k	MASUK_PULANG	cmck0hr8y0002twsd7q1cw7g8	2025-07-03 01:17:55.599	2025-07-03 01:17:55.599
cmcmpai4300bptwsd54tfh86c	MASUK_PULANG	cmck40i2v0018twsdmoshgxtd	2025-07-03 01:22:14.451	2025-07-03 01:22:14.451
cmcmq602400cftwsdse4wmfbt	MASUK_PULANG	cmck418fo001etwsdhf12cdrj	2025-07-03 01:46:44.044	2025-07-03 01:46:44.044
cmco2nybt00j3twsdpwxvg0i2	MASUK_PULANG	cmc48mero00nvtwlko7dnse2m	2025-07-04 00:24:23.178	2025-07-04 00:24:23.178
cmco4h4qb00jdtwsdqo3wjgtw	MASUK_PULANG	cmck406q40014twsd4gqd9j1a	2025-07-04 01:15:04.116	2025-07-04 01:15:04.116
cmcsbfvr300p3twsdayskqa6h	MASUK_PULANG	cmck461f1002atwsd7hvt6jif	2025-07-06 23:41:07.84	2025-07-06 23:41:07.84
cmcsf40nn00qptwsd524efqwu	MASUK_PULANG	cmc48n8mc00nztwlkq8l3p7ok	2025-07-07 01:23:52.787	2025-07-07 01:23:52.787
cmcsse52o00rntwsd0w11oolo	MASUK_PULANG	cmck40wej001atwsdpzxns3dc	2025-07-07 07:35:40.081	2025-07-07 07:35:40.081
cmcttgbjj00yrtwsdauu5mt0u	MASUK_PULANG	cmck45ltr0026twsdhzuwstv3	2025-07-08 00:53:07.567	2025-07-08 00:53:07.567
cmctujj4w00zbtwsd52cgzh6h	MASUK_PULANG	cmck4dzm8002gtwsdwfchlzo8	2025-07-08 01:23:36.992	2025-07-08 01:23:36.992
cmcv68ora0155twsdkzozowco	MASUK_PULANG	cmck439di001utwsdypps76dc	2025-07-08 23:38:52.63	2025-07-08 23:38:52.63
cmcv6cisv015ltwsdidf1iu97	MASUK_PULANG	cmck468tu002ctwsd61d0pz44	2025-07-08 23:41:51.535	2025-07-08 23:41:51.535
cmcv7x0qm0177twsdrh5vhwk2	MASUK_PULANG	cmck3y53f000stwsdvoovf2pk	2025-07-09 00:25:47.518	2025-07-09 00:25:47.518
cmcv9a71e017xtwsdk7wm9yzo	MASUK_PULANG	cmck0vrtn000gtwsdjzf0zz94	2025-07-09 01:04:01.826	2025-07-09 01:04:01.826
cmcwmn6n301g3twsdj75hjsp0	MASUK_PULANG	cmck45utb0028twsd8uf3m0ef	2025-07-10 00:05:49.023	2025-07-10 00:05:49.023
cmcy2t6qp01nbtwsdf9eftv3h	MASUK_PULANG	cmck0uy49000ctwsdmr363t36	2025-07-11 00:26:09.121	2025-07-11 00:26:09.121
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: jurnal_user
--

COPY public.students (id, "userId", nisn, kelas, jurusan, "tempatPklId", "createdAt", "updatedAt", "teacherId") FROM stdin;
cmbiwwmaq000htw0fr4apz5p8	cmbiwwmad000btw0fdskxuie6	2024001003	XII RPL 2	Rekayasa Perangkat Lunak	tempat2	2025-06-05 05:04:36.578	2025-06-05 15:42:47.244	cmbiwwm9i0004tw0fdfr46otb
cmbiwwmam000ftw0f0u11ve8o	cmbiwwma9000atw0fl6p2qz9s	2024001002	XII RPL 1	Rekayasa Perangkat Lunak	tempat2	2025-06-05 05:04:36.575	2025-06-07 13:07:51.464	cmbiwwm9i0004tw0fdfr46otb
cmc46pctz001ptwlko6va5kot	cmc46pcsa001ntwlk060savo2	0038700729	XII	TKJT	cmc48rtmy00o1twlk3uhabwd0	2025-06-20 02:22:03.575	2025-06-24 06:25:09.565	cmbiwwm9i0004tw0fdfr46otb
cmc46psei003xtwlkve7bkjpy	cmc46pse7003vtwlk2cod7udq	0089041978	XII	PPLG	cmck3zh9t000wtwsdy9eyy6jv	2025-06-20 02:22:23.754	2025-07-01 06:00:34.632	cmbiwwm9i0004tw0fdfr46otb
cmc46q3kk005dtwlk36s2a65a	cmc46q3ic005btwlki5621cpg	0088730676	XII	PPLG	cmck4dzm8002gtwsdwfchlzo8	2025-06-20 02:22:38.228	2025-07-01 06:01:52.402	cmbiwwm9i0004tw0fdfr46otb
cmc46ptun0045twlkjz41wc1h	cmc46ptrw0043twlk9gg4cirh	0088322723	XII	PPLG	cmck3zh9t000wtwsdy9eyy6jv	2025-06-20 02:22:25.631	2025-07-01 06:02:54.553	cmbiwwm9i0004tw0fdfr46otb
cmc46p4fv000etwlk7b55fk8g	cmc46p4eb000ctwlklxffjw5o	0061941612	XII	TKJT	cmck3zh9t000wtwsdy9eyy6jv	2025-06-20 02:21:52.699	2025-07-01 06:03:26.407	cmbiwwm9i0004tw0fdfr46otb
cmc46putt0049twlkz0v03scf	cmc46puqq0047twlkefyw6mi7	007927892	XII	PPLG	cmck3zh9t000wtwsdy9eyy6jv	2025-06-20 02:22:26.898	2025-07-01 06:04:57.355	cmbiwwm9i0004tw0fdfr46otb
cmc46p7y00012twlkan1t901y	cmc46p7xk0010twlkhds62i7n	0067223535	XII	TKJT	cmc48mero00nvtwlko7dnse2m	2025-06-20 02:21:57.24	2025-07-01 06:32:02.817	cmbiwwm9i0004tw0fdfr46otb
cmc46pvoz004dtwlkwqdry1x1	cmc46pvnd004btwlk0nvv833f	0089123412	XII	PPLG	cmck448ke0020twsddlrk90by	2025-06-20 02:22:28.019	2025-07-01 06:11:22.236	cmbiwwm9i0004tw0fdfr46otb
cmc46q7m6005qtwlksgmx27n4	cmc46q7bu005ntwlkatntz1fr	0083742107	XII	AKL	cmc48mqk900nxtwlkpuu6o5zz	2025-06-20 02:22:43.471	2025-07-01 06:13:30.8	cmbiwwm9i0004tw0fdfr46otb
cmc46p5bc000ktwlkk8ewcctu	cmc46p5b8000itwlkoyi29eyv	0072998707	XII	TKJT	cmck44fxi0022twsdqewf2qfz	2025-06-20 02:21:53.832	2025-07-01 06:16:22.169	cmbiwwm9i0004tw0fdfr46otb
cmc46pwha004itwlkuzsyazgn	cmc46pwh6004gtwlkyfdjw27i	0085689501	XII	PPLG	cmc48mero00nvtwlko7dnse2m	2025-06-20 02:22:29.038	2025-07-01 06:16:50.974	cmbiwwm9i0004tw0fdfr46otb
cmc46px46004ltwlkbeei43ix	cmc46px16004jtwlk3ws5nkk7	0072586104	XII	PPLG	cmc48mero00nvtwlko7dnse2m	2025-06-20 02:22:29.862	2025-07-01 06:18:57.875	cmbiwwm9i0004tw0fdfr46otb
cmc46q9ut005xtwlkhtlk8doe	cmc46q9is005vtwlkicwhgcec	0088209171	XII	AKL	cmck3z3zg000utwsdom83qtzx	2025-06-20 02:22:46.373	2025-07-01 06:19:34.093	cmbiwwm9i0004tw0fdfr46otb
cmc46qc9w0067twlkcuynnxtk	cmc46qc220063twlkt41puyl7	0073903725	XII	AKL	cmck0qlgg0008twsdeysp7xwp	2025-06-20 02:22:49.508	2025-07-01 06:23:22.591	cmbiwwm9i0004tw0fdfr46otb
cmc46p6jo000ttwlkjoqzjw5q	cmc46p6jj000rtwlk91ppbljr	0077360366	XII	TKJT	cmck41lu4001gtwsdh9n41hyu	2025-06-20 02:21:55.428	2025-07-01 06:24:26.965	cmbiwwm9i0004tw0fdfr46otb
cmc46p6zu000wtwlk8cv819k1	cmc46p6yi000utwlk9g4caeus	0084491296	XII	TKJT	cmck58yj9002itwsdcqhqroi1	2025-06-20 02:21:55.969	2025-07-01 06:25:56.324	cmbiwwm9i0004tw0fdfr46otb
cmc46p7f3000ztwlknmgw5twf	cmc46p7ei000xtwlkji471nyt	0074437909	XII	TKJT	cmck3zogi000ytwsdrxv1jqd0	2025-06-20 02:21:56.559	2025-07-01 06:29:00.328	cmbiwwm9i0004tw0fdfr46otb
cmc46qgrp006ltwlkgmd3zvcp	cmc46qggs006jtwlka0iwxp7n	0073112408	XII	AKL	cmc48mqk900nxtwlkpuu6o5zz	2025-06-20 02:22:55.334	2025-07-01 06:33:28.806	cmbiwwm9i0004tw0fdfr46otb
cmc46p8e60015twlkpm6xqld4	cmc46p8dw0013twlk9f5tbsmz	0074594805	XII	TKJT	cmck45ltr0026twsdhzuwstv3	2025-06-20 02:21:57.822	2025-07-01 06:34:13.353	cmbiwwm9i0004tw0fdfr46otb
cmc46q1y10055twlk6l4h720o	cmc46q1w90053twlkoiph3n9c	0083974341	XII	PPLG	cmck3zh9t000wtwsdy9eyy6jv	2025-06-20 02:22:36.122	2025-07-01 06:36:03.13	cmbiwwm9i0004tw0fdfr46otb
cmc46pa83001dtwlkw34o2zus	cmc46pa58001btwlkmto4zk2o	0086029025	XII	TKJT	cmck461f1002atwsd7hvt6jif	2025-06-20 02:22:00.196	2025-07-01 06:37:36.485	cmbiwwm9i0004tw0fdfr46otb
cmc46q2rq005atwlks6oghu8m	cmc46q2rf0057twlkxjp764wg	00751327533	XII	PPLG	cmck4dzm8002gtwsdwfchlzo8	2025-06-20 02:22:37.191	2025-07-01 06:41:34.835	cmbiwwm9i0004tw0fdfr46otb
cmc46pc16001ltwlkd7477efh	cmc46pbya001jtwlk6mp1er7g	0089313806	XII	TKJT	cmck468tu002ctwsd61d0pz44	2025-06-20 02:22:02.538	2025-07-01 06:41:24.913	cmbiwwm9i0004tw0fdfr46otb
cmc46qlb20073twlkwsk9yxzh	cmc46ql4s006ztwlk3y86v3zv	0087624050	XII	AKL	cmc48mqk900nxtwlkpuu6o5zz	2025-06-20 02:23:01.215	2025-07-01 06:47:10.822	cmbiwwm9i0004tw0fdfr46otb
cmc46qnhi007atwlkoshg5ob4	cmc46qn9x0077twlkozinetgx	0078651346	XII	AKL	cmck0qlgg0008twsdeysp7xwp	2025-06-20 02:23:04.038	2025-07-01 06:53:57.936	cmbiwwm9i0004tw0fdfr46otb
cmc46ped8001ytwlkfrb06txj	cmc46ped1001vtwlknd3sixtx	0072778880	XII	TKJT	cmck40wej001atwsdpzxns3dc	2025-06-20 02:22:05.564	2025-07-01 06:53:36.796	cmbiwwm9i0004tw0fdfr46otb
cmc46pf530021twlkuuodzcss	cmc46pf2d001ztwlkao13x2n4	0075907756	XII	TKJT	cmc48mero00nvtwlko7dnse2m	2025-06-20 02:22:06.567	2025-07-01 06:54:29.085	cmbiwwm9i0004tw0fdfr46otb
cmc46pxyb004ptwlk2lkmy29h	cmc46pxvf004ntwlk3umo14ka	0087784440	XII	PPLG	cmck40cr50016twsdir1pcyun	2025-06-20 02:22:30.947	2025-07-01 06:57:11.36	cmbiwwm9i0004tw0fdfr46otb
cmc46pfw20026twlkeuha5zir	cmc46pfvx0023twlku4auzv26	0086387057	XII	TKJT	cmck0uy49000ctwsdmr363t36	2025-06-20 02:22:07.538	2025-07-01 06:57:59.343	cmbiwwm9i0004tw0fdfr46otb
cmc46pghq0029twlka9885aqa	cmc46pgeu0027twlkbp3fltce	0062997639	XII	TKJT	cmck468tu002ctwsd61d0pz44	2025-06-20 02:22:08.318	2025-07-01 06:58:29.976	cmbiwwm9i0004tw0fdfr46otb
cmc46qs78007qtwlkv76qqm1t	cmc46qrws007ntwlkth37r9a5	0087472673	XII	AKL	cmc48mqk900nxtwlkpuu6o5zz	2025-06-20 02:23:10.148	2025-07-01 06:59:18.55	cmbiwwm9i0004tw0fdfr46otb
cmc46pizj002mtwlk8pxdg8ys	cmc46pizc002jtwlkctbiz503	0083580156	XII	TKJT	cmck45ltr0026twsdhzuwstv3	2025-06-20 02:22:11.551	2025-07-01 07:01:21.721	cmbiwwm9i0004tw0fdfr46otb
cmc46pjq9002ptwlkdlsbonh2	cmc46pjny002ntwlk5hhj2h34	0085230985	XII	TKJT	cmck41lu4001gtwsdh9n41hyu	2025-06-20 02:22:12.513	2025-07-01 07:02:19.361	cmbiwwm9i0004tw0fdfr46otb
cmc46pkez002ttwlknaeob0ip	cmc46pkc3002rtwlkvwh8l35l	0073818403	XII	TKJT	cmck40wej001atwsdpzxns3dc	2025-06-20 02:22:13.403	2025-07-01 07:07:14.393	cmbiwwm9i0004tw0fdfr46otb
cmc46qyuo008gtwlkpfrhsk5a	cmc46qyr8008btwlkdenct26n	0084853875	XII	AKL	cmc48mqk900nxtwlkpuu6o5zz	2025-06-20 02:23:18.769	2025-07-01 07:08:13.847	cmbiwwm9i0004tw0fdfr46otb
cmc46pyy9004ttwlkurhcszen	cmc46pyxh004rtwlkk9w5g06t	0077386388	XII	PPLG	cmck40cr50016twsdir1pcyun	2025-06-20 02:22:32.241	2025-07-01 07:09:04.123	cmbiwwm9i0004tw0fdfr46otb
cmc46pm0s0032twlkvihkm06d	cmc46pm0l002ztwlkj5dhutgs	0083961166	XII	TKJT	cmck0uy49000ctwsdmr363t36	2025-06-20 02:22:15.485	2025-07-01 07:09:53.552	cmbiwwm9i0004tw0fdfr46otb
cmc46pq1s003ltwlkhuevqi62	cmc46ppyv003jtwlk4nj0rn2f	0082639179	XII	TKJT	cmck44fxi0022twsdqewf2qfz	2025-06-20 02:22:20.705	2025-07-01 07:12:27.341	cmbiwwm9i0004tw0fdfr46otb
cmc46pnhf003atwlk0zw4shj9	cmc46pnha0037twlkw2s8f57e	0072966140	XII	TKJT	cmck439di001utwsdypps76dc	2025-06-20 02:22:17.38	2025-07-01 07:13:03.558	cmbiwwm9i0004tw0fdfr46otb
cmc46q046004ytwlk6fbdyzik	cmc46q03w004vtwlkbokfxtyy	0081379823	XII	PPLG	cmck448ke0020twsddlrk90by	2025-06-20 02:22:33.751	2025-07-01 07:14:11.777	cmbiwwm9i0004tw0fdfr46otb
cmc46pp3s003htwlkl4no5tkd	cmc46pp13003ftwlkobra7cp4	0076358703	XII	TKJT	cmck0hr8y0002twsd7q1cw7g8	2025-06-20 02:22:19.48	2025-07-01 07:14:30.579	cmbiwwm9i0004tw0fdfr46otb
cmc46syu600fitwlkynzot5ep	cmc46sylk00fftwlkshimcgl1	0085600198	XII	TKRO	\N	2025-06-20 02:24:52.062	2025-06-20 02:24:52.062	\N
cmc46t3d000g1twlkqj47w0qc	cmc46t3am00fvtwlklpjf26ub	0071683853	XII	TKRO	\N	2025-06-20 02:24:57.925	2025-06-20 02:24:57.925	\N
cmc46u74o00k0twlk19qr70iq	cmc46u70j00jvtwlkdm1zeg8i	0073337225	XII	TKRO	\N	2025-06-20 02:25:49.465	2025-06-20 02:25:49.465	\N
cmc46ss6b00eutwlkea69ajma	cmc46sryp00ertwlk5lx32cio	0088378236	XII	TKRO	cmck0w6nf000itwsda5g88e65	2025-06-20 02:24:43.427	2025-07-01 05:58:15.397	cmbiwwm9i0004tw0fdfr46otb
cmc46sufy00f1twlkyabfajk9	cmc46su6k00eztwlktx4kqj4k	0062528799	XII	TKRO	cmck406q40014twsd4gqd9j1a	2025-06-20 02:24:46.367	2025-07-01 05:58:45.974	cmbiwwm9i0004tw0fdfr46otb
cmc46swpg00fetwlkx51xpyx3	cmc46swop00f7twlkgrtanzlb	0139336965	XII	TKRO	cmck406q40014twsd4gqd9j1a	2025-06-20 02:24:49.284	2025-07-01 06:02:05.051	cmbiwwm9i0004tw0fdfr46otb
cmc46t5kl00g8twlkurga8kks	cmc46t5hj00g3twlkenbbpi9y	0083213421	XII	TKRO	cmck0vrtn000gtwsdjzf0zz94	2025-06-20 02:25:00.79	2025-07-01 06:14:20.659	cmbiwwm9i0004tw0fdfr46otb
cmc46rpmn00b3twlk3kcu7mik	cmc46rpgc00aztwlkv8qw68ap	0086651539	XII	AKL	cmck40wej001atwsdpzxns3dc	2025-06-20 02:23:53.471	2025-07-01 06:15:25.77	cmbiwwm9i0004tw0fdfr46otb
cmc46rry000batwlkc67fga2c	cmc46rrnb00b7twlkv8iwojru	0075544834	XII	AKL	cmck42day001ktwsdbcebpkvk	2025-06-20 02:23:56.472	2025-07-01 06:17:14.079	cmbiwwm9i0004tw0fdfr46otb
cmc46ru3200bhtwlkqx7b7u7h	cmc46rtuc00bftwlknoy1bc29	0072944365	XII	AKL	cmck40wej001atwsdpzxns3dc	2025-06-20 02:23:59.247	2025-07-01 06:18:02.101	cmbiwwm9i0004tw0fdfr46otb
cmc46rwds00bstwlkvna2msl2	cmc46rwbm00bntwlk5tby5fad	0081609950	XII	AKL	cmck0qlgg0008twsdeysp7xwp	2025-06-20 02:24:02.224	2025-07-01 06:18:35.373	cmbiwwm9i0004tw0fdfr46otb
cmc46ryle00bztwlkx7awij04	cmc46rygd00bvtwlkwst2y7ei	0077805691	XII	AKL	cmck3zuvk0010twsdkc3xecuu	2025-06-20 02:24:05.091	2025-07-01 06:20:38.829	cmbiwwm9i0004tw0fdfr46otb
cmc46u4wn00jttwlknf6i98n9	cmc46u4uf00jntwlk6i894665	0074048858	XII	TKRO	cmck0igbm0006twsdbpvnfvxz	2025-06-20 02:25:46.583	2025-07-01 06:23:00.476	cmbiwwm9i0004tw0fdfr46otb
cmc46t7qd00gftwlkllmm3na2	cmc46t7lg00gbtwlk77gvf3z7	0081232725	XII	TKRO	cmck0igbm0006twsdbpvnfvxz	2025-06-20 02:25:03.59	2025-07-01 06:32:26.015	cmbiwwm9i0004tw0fdfr46otb
cmc46u9cw00k7twlkl4q1lryt	cmc46u96c00k3twlk7i3pxz78	0064128213	XII	TKRO	cmck459zd0024twsdbk2mv6xz	2025-06-20 02:25:52.352	2025-07-01 06:35:01.715	cmbiwwm9i0004tw0fdfr46otb
cmc46s59s00cqtwlkc8385tg3	cmc46s59i00cjtwlkelqn8wpc	3072952968	XII	AKL	cmck3zuvk0010twsdkc3xecuu	2025-06-20 02:24:13.744	2025-07-01 06:36:23.32	cmbiwwm9i0004tw0fdfr46otb
cmc46s7ji00cxtwlkoex1sm53	cmc46s7gz00crtwlkgxltgsdy	0085429243	XII	AKL	cmck413cb001ctwsddb4r6abm	2025-06-20 02:24:16.686	2025-07-01 06:42:35.655	cmbiwwm9i0004tw0fdfr46otb
cmc46s9u700d3twlkxxrzmirt	cmc46s9p200cztwlk5o0ksh3k	0076597884	XII	AKL	cmck3zuvk0010twsdkc3xecuu	2025-06-20 02:24:19.663	2025-07-01 06:44:44.453	cmbiwwm9i0004tw0fdfr46otb
cmc46r7ti009dtwlkxkev0j8x	cmc46r7rk0097twlkjoevspif	3088419492	XII	AKL	cmck40i2v0018twsdmoshgxtd	2025-06-20 02:23:30.39	2025-07-01 07:11:15.647	cmbiwwm9i0004tw0fdfr46otb
cmc46sc4a00datwlklba5fy78	cmc46sbuo00d7twlkn6u6zkva	0077930827	XII	AKL	cmck435iu001stwsdbk5h55wi	2025-06-20 02:24:22.618	2025-07-01 06:56:32.004	cmbiwwm9i0004tw0fdfr46otb
cmc46seaw00dhtwlknxsz3ms1	cmc46se2f00dftwlkntz7qmvq	0058328668	XII	AKL	cmck40wej001atwsdpzxns3dc	2025-06-20 02:24:25.448	2025-07-01 06:58:47.196	cmbiwwm9i0004tw0fdfr46otb
cmc46sgjj00dttwlk2n9q1jja	cmc46sgiw00dntwlkirexb1hm	0077059277	XII	AKL	cmc48n8mc00nztwlkq8l3p7ok	2025-06-20 02:24:28.352	2025-07-01 07:01:41.259	cmbiwwm9i0004tw0fdfr46otb
cmc46r137008ntwlk9lsvz5md	cmc46r0xd008jtwlksjd4we4h	0081311700	XII	AKL	cmck40cr50016twsdir1pcyun	2025-06-20 02:23:21.668	2025-07-01 07:09:38.656	cmbiwwm9i0004tw0fdfr46otb
cmc46r3af008utwlkutramzmy	cmc46r30r008rtwlkvlh7txua	0071987771	XII	AKL	cmck40i2v0018twsdmoshgxtd	2025-06-20 02:23:24.52	2025-07-01 07:10:12.213	cmbiwwm9i0004tw0fdfr46otb
cmc46r5k40091twlkc6d32ylm	cmc46r583008ztwlkxhfnmeut	0076742856	XII	AKL	cmck0qlgg0008twsdeysp7xwp	2025-06-20 02:23:27.46	2025-07-01 07:10:37.945	cmbiwwm9i0004tw0fdfr46otb
cmc46t12y00fptwlkqbiheqi2	cmc46t0rj00fntwlkgtjdwdkk	0085117305	XII	TKRO	cmck3xw5t000qtwsdwrv2o0ua	2025-06-20 02:24:54.971	2025-07-02 23:12:55.138	cmbiwwm9i0004tw0fdfr46otb
cmc46tgia00hdtwlk9jubdxoj	cmc46tgfh00h7twlkhpaew46m	0076863584	XII	TKRO	\N	2025-06-20 02:25:14.962	2025-06-20 02:25:14.962	\N
cmc46ui4n00l3twlksshn6m2e	cmc46uhzp00kztwlkgz8b3fum	0082585744	XII	TKRO	\N	2025-06-20 02:26:03.72	2025-06-20 02:26:03.72	\N
cmc46umj600lhtwlkvczfsapg	cmc46um8w00lftwlkaqc6aq0l	0077976597	XII	TKRO	\N	2025-06-20 02:26:09.426	2025-06-20 02:26:09.426	\N
cmc46uqxb00m1twlkvscfl7nx	cmc46uqv400lvtwlkll8xzjf4	0076268909	XII	TKRO	\N	2025-06-20 02:26:15.119	2025-06-20 02:26:15.119	\N
cmc46ut3l00m8twlkvvdmmbls	cmc46ut0f00m3twlkqgyhf3hm	0086921143	XII	TKRO	\N	2025-06-20 02:26:17.937	2025-06-20 02:26:17.937	\N
cmc46v6e500nktwlkdwhp9sfd	cmc46v6a600nftwlkujwmtc53	0074149317	XII	TKRO	\N	2025-06-20 02:26:35.165	2025-06-20 02:26:35.165	\N
cmc46q15w0052twlkhtfrzd6q	cmc46q15j004ztwlk8dvbn3lr	0074394201	XII	PPLG	cmck4dzm8002gtwsdwfchlzo8	2025-06-20 02:22:35.108	2025-07-01 06:04:33.352	cmbiwwm9i0004tw0fdfr46otb
cmc46v1wm00n6twlkiho2y5qd	cmc46v1wb00mztwlkdty5a2y9	0089274434	XII	TKRO	cmca53uno00o7twlkyp4pdtpz	2025-06-20 02:26:29.351	2025-06-24 06:24:32.597	cmbiwwm9i0004tw0fdfr46otb
cmc46u2oh00jmtwlkal64ma59	cmc46u2o700jftwlkum4j5udo	0067593618	XII	TKRO	cmca53uno00o7twlkyp4pdtpz	2025-06-20 02:25:43.698	2025-06-24 06:24:40.24	cmbiwwm9i0004tw0fdfr46otb
cmc46trp000ihtwlkk9doz5ah	cmc46trme00ibtwlk8l0kz6v3	0088498942	XII	TKRO	cmca53cvo00o5twlke9erzxzp	2025-06-20 02:25:29.46	2025-06-24 06:24:47.219	cmbiwwm9i0004tw0fdfr46otb
cmc46pi7s002htwlk9tebi51u	cmc46pi5v002ftwlk2jp5x5to	0066545451	XII	TKJT	cmc48rtmy00o1twlk3uhabwd0	2025-06-20 02:22:10.551	2025-06-24 06:24:58.003	cmbiwwm9i0004tw0fdfr46otb
cmc46rehr009ytwlk6ymfhb80	cmc46rebf009vtwlkl5syd35d	0071200404	XII	AKL	cmck42day001ktwsdbcebpkvk	2025-06-20 02:23:39.04	2025-07-01 05:59:15.927	cmbiwwm9i0004tw0fdfr46otb
cmc46prm8003ttwlkgahsy2jt	cmc46prjs003rtwlkh7yhaoof	1223111233	XII	TKJT	cmck3zogi000ytwsdrxv1jqd0	2025-06-20 02:22:22.736	2025-07-01 05:59:38.1	cmbiwwm9i0004tw0fdfr46otb
cmc46rgo400a5twlk8xzlphlx	cmc46rgfo00a3twlkac8ozm4p	0061405342	XII	AKL	cmc48mqk900nxtwlkpuu6o5zz	2025-06-20 02:23:41.86	2025-07-01 05:59:52.441	cmbiwwm9i0004tw0fdfr46otb
cmc46ty9b00j2twlk0v0ot3fh	cmc46ty3l00iztwlkxx70so9r	0081265304	XII	TKRO	cmck46kxe002etwsdz4vk306h	2025-06-20 02:25:37.967	2025-07-01 06:00:15.318	cmbiwwm9i0004tw0fdfr46otb
cmc46u0fj00j9twlk1sbyrrvb	cmc46u07k00j7twlkkzjc1vzj	0086962382	XII	TKRO	cmck459zd0024twsdbk2mv6xz	2025-06-20 02:25:40.783	2025-07-01 06:15:50.117	cmbiwwm9i0004tw0fdfr46otb
cmc46pt0l0041twlk75hwckll	cmc46psxp003ztwlkmr3y4uh9	0078950883	XII	PPLG	cmck4dzm8002gtwsdwfchlzo8	2025-06-20 02:22:24.549	2025-07-01 06:02:19.945	cmbiwwm9i0004tw0fdfr46otb
cmc46q5ev005jtwlkm0nl2m8g	cmc46q56a005ftwlky9ongame	0075590450	XII	AKL	cmck418fo001etwsdhf12cdrj	2025-06-20 02:22:40.615	2025-07-01 06:10:53.959	cmbiwwm9i0004tw0fdfr46otb
cmc46rixs00aitwlkpg86h565	cmc46rixh00abtwlke3dx7cla	0056118922	XII	AKL	cmck40wej001atwsdpzxns3dc	2025-06-20 02:23:44.8	2025-07-01 06:12:30.294	cmbiwwm9i0004tw0fdfr46otb
cmc46rl4j00aptwlk6zhyn8iu	cmc46rl2m00ajtwlknqqunm68	0089825586	XII	AKL	cmck43th1001wtwsd045u0dls	2025-06-20 02:23:47.636	2025-07-01 06:12:54.861	cmbiwwm9i0004tw0fdfr46otb
cmc46rndz00awtwlkmxzfjiix	cmc46rn9f00artwlkhvcf2cv8	007307992	XII	AKL	cmc48mqk900nxtwlkpuu6o5zz	2025-06-20 02:23:50.567	2025-07-01 06:13:45.626	cmbiwwm9i0004tw0fdfr46otb
cmc46p4vg000htwlknsc6tpqz	cmc46p4uy000ftwlkrsizh2ct	0075506445	XII	TKJT	cmck440oy001ytwsdh7hdy73b	2025-06-20 02:21:53.26	2025-07-01 06:14:05.893	cmbiwwm9i0004tw0fdfr46otb
cmc46p5ql000ntwlkqrw64rf6	cmc46p5qi000ltwlk1hkc5x4y	0075746049	XII	TKJT	cmc48mero00nvtwlko7dnse2m	2025-06-20 02:21:54.382	2025-07-01 06:17:41.573	cmbiwwm9i0004tw0fdfr46otb
cmc46s0v200c6twlkxc2576re	cmc46s0ma00c3twlk7u5hhkyk	0078932280	XII	AKL	cmck42day001ktwsdbcebpkvk	2025-06-20 02:24:08.03	2025-07-01 06:21:26.825	cmbiwwm9i0004tw0fdfr46otb
cmc46p64g000qtwlkv3exmjxb	cmc46p64d000otwlkh23chiod	0062945172	XII	TKJT	cmck461f1002atwsd7hvt6jif	2025-06-20 02:21:54.88	2025-07-01 06:23:08.857	cmbiwwm9i0004tw0fdfr46otb
cmc46qeik006etwlk22jwlw57	cmc46qe92006ctwlk23frgkcc	0073339824	XII	AKL	cmck42pk6001otwsdlv11onid	2025-06-20 02:22:52.412	2025-07-01 06:24:41.234	cmbiwwm9i0004tw0fdfr46otb
cmc46s31000cdtwlkt2zewnu5	cmc46s2sy00cbtwlk494n9stz	0081572630	XII	AKL	cmck413cb001ctwsddb4r6abm	2025-06-20 02:24:10.836	2025-07-01 06:25:03.447	cmbiwwm9i0004tw0fdfr46otb
cmc46pque003ptwlkz4fc44v0	cmc46pqrh003ntwlklvpgi2r9	0083816967	XII	TKJT	cmck0hr8y0002twsd7q1cw7g8	2025-06-20 02:22:21.734	2025-07-01 06:29:56.184	cmbiwwm9i0004tw0fdfr46otb
cmc46spmt00eltwlky5x0wzju	cmc46sp9u00ejtwlk16enk2bo	0089617893	XII	AKL	cmck42day001ktwsdbcebpkvk	2025-06-20 02:24:40.133	2025-07-01 06:30:34.559	cmbiwwm9i0004tw0fdfr46otb
cmc46t9xm00gmtwlk54san151	cmc46t9q900gjtwlketoyds2j	0089181514	XII	TKRO	cmck42xch001qtwsdoospemwt	2025-06-20 02:25:06.442	2025-07-01 06:33:11.677	cmbiwwm9i0004tw0fdfr46otb
cmc46p9dx0019twlk90er4978	cmc46p9b00017twlk1vgawujj	0069718576	XII	TKJT	cmck439di001utwsdypps76dc	2025-06-20 02:21:59.109	2025-07-01 06:34:43.104	cmbiwwm9i0004tw0fdfr46otb
cmc46te9a00h6twlkzi0i6wfs	cmc46te9000gztwlk9ijdtmox	0075284499	XII	TKRO	cmck0w6nf000itwsda5g88e65	2025-06-20 02:25:12.046	2025-07-01 06:37:13.755	cmbiwwm9i0004tw0fdfr46otb
cmc46ufyz00kwtwlkr2ptbevg	cmc46ufv500krtwlke1j3w6wd	0076989808	XII	TKRO	cmck0vjc1000etwsdvou1e2h3	2025-06-20 02:26:00.923	2025-07-01 06:37:58.595	cmbiwwm9i0004tw0fdfr46otb
cmc46uopi00lutwlk6ky20hrv	cmc46uop800lntwlkg9comfzc	0089803136	XII	TKRO	cmck406q40014twsd4gqd9j1a	2025-06-20 02:26:12.246	2025-07-01 06:40:01.34	cmbiwwm9i0004tw0fdfr46otb
cmc46tc4d00gttwlktvokwl2h	cmc46tbvn00grtwlkcff9op0m	0073026438	XII	TKRO	cmck0w6nf000itwsda5g88e65	2025-06-20 02:25:09.278	2025-07-01 06:41:56.307	cmbiwwm9i0004tw0fdfr46otb
cmc46rcbv009rtwlkrdwu5dht	cmc46rc5v009ntwlku41soo8q	2112111211	XII	AKL	cmck3z3zg000utwsdom83qtzx	2025-06-20 02:23:36.235	2025-07-01 06:44:30.321	cmbiwwm9i0004tw0fdfr46otb
cmc46tkyl00hrtwlkewcqik62	cmc46tkri00hntwlknorloih9	0084233136	XII	TKRO	cmck0tens000atwsdmwj9xk2w	2025-06-20 02:25:20.733	2025-07-01 07:00:12.758	cmbiwwm9i0004tw0fdfr46otb
cmc46tpdi00i5twlk1j4f4z5b	cmc46tp3100i3twlkmmodqo42	0064874677	XII	TKRO	cmco094a600i0twsddog0h3ml	2025-06-20 02:25:26.455	2025-07-03 23:17:07.712	cmbiwwm9i0004tw0fdfr46otb
cmc46v45w00ndtwlk563qy6nd	cmc46v43i00n7twlkfce7t5ty	0078342659	XII	TKRO	cmck406q40014twsd4gqd9j1a	2025-06-20 02:26:32.276	2025-07-01 07:03:37.841	cmbiwwm9i0004tw0fdfr46otb
cmc46sl0j00e7twlkracec5rj	cmc46skv100e3twlkvio5zf3c	0071500674	XII	AKL	cmck0qlgg0008twsdeysp7xwp	2025-06-20 02:24:34.147	2025-07-01 07:09:25.012	cmbiwwm9i0004tw0fdfr46otb
cmc46uxgz00mmtwlkbxu9absu	cmc46ux9300mjtwlkkuypmvev	0076359502	XII	TKRO	cmck42xch001qtwsdoospemwt	2025-06-20 02:26:23.603	2025-07-01 07:11:37.242	cmbiwwm9i0004tw0fdfr46otb
cmc46sneu00eetwlk7gnrmbf8	cmc46sn3e00ebtwlkvv02znq5	0082263751	XII	AKL	cmck3zuvk0010twsdkc3xecuu	2025-06-20 02:24:37.254	2025-07-01 07:12:48.569	cmbiwwm9i0004tw0fdfr46otb
cmc46ttvb00iotwlkamx55iuo	cmc46ttrx00ijtwlkwjd2trx9	0077039726	XII	TKRO	cmck0vrtn000gtwsdjzf0zz94	2025-06-20 02:25:32.279	2025-07-01 07:13:19.738	cmbiwwm9i0004tw0fdfr46otb
cmc46tn5q00hytwlknc1ofewc	cmc46tmxj00hvtwlkd9pf11un	3070510778	XII	TKRO	cmck3xw5t000qtwsdwrv2o0ua	2025-06-20 02:25:23.583	2025-07-02 23:09:59.578	cmbiwwm9i0004tw0fdfr46otb
cmc46tiru00hktwlk85dmpfyh	cmc46timq00hftwlkp74p6m3a	0072715833	XII	TKRO	cmck45utb0028twsd8uf3m0ef	2025-06-20 02:25:17.898	2025-07-04 00:18:55.078	\N
cmc46v8mu00nrtwlkm3c62zp1	cmc46v8gy00nntwlkvik0x106	007116467	XII	TKRO	cmck3xw5t000qtwsdwrv2o0ua	2025-06-20 02:26:38.07	2025-07-01 06:35:46.633	cmbiwwm9i0004tw0fdfr46otb
cmc46ubh400ketwlkkfu8nopc	cmc46ub7r00kbtwlk5cwc42lr	0083899328	XII	TKRO	cmck401eu0012twsds1qwqjw4	2025-06-20 02:25:55.096	2025-07-01 06:36:45.033	cmbiwwm9i0004tw0fdfr46otb
cmc46pb8h001htwlkcoeyq3bg	cmc46pb5d001ftwlkdfc9jas6	0068325693	XII	TKJT	cmck3zogi000ytwsdrxv1jqd0	2025-06-20 02:22:01.505	2025-07-01 06:38:37.528	cmbiwwm9i0004tw0fdfr46otb
cmc46ukau00latwlko97z1t2t	cmc46uk4100l7twlkw8fmsurt	0092891642	XII	TKRO	cmck0igbm0006twsdbpvnfvxz	2025-06-20 02:26:06.534	2025-07-01 06:38:54.893	cmbiwwm9i0004tw0fdfr46otb
cmc46udog00kltwlk8mp3jpsw	cmc46udd700kjtwlky73yugpy	0087933432	XII	TKRO	cmck3xw5t000qtwsdwrv2o0ua	2025-06-20 02:25:57.953	2025-07-01 06:42:10.062	cmbiwwm9i0004tw0fdfr46otb
cmc46qj48006wtwlkxjg53s62	cmc46qiza006rtwlksqlqsp7j	0078066805	XII	AKL	cmck40i2v0018twsdmoshgxtd	2025-06-20 02:22:58.376	2025-07-01 06:42:25.973	cmbiwwm9i0004tw0fdfr46otb
cmc46pdme001utwlksga35tj7	cmc46pdm3001rtwlkvpt18rsv	0081789678	XII	TKJT	cmck41lu4001gtwsdh9n41hyu	2025-06-20 02:22:04.598	2025-07-01 06:53:02.297	cmbiwwm9i0004tw0fdfr46otb
cmc46qpxp007jtwlkmf7x9mjw	cmc46qpu6007ftwlk2hyxjqer	0074132977	XII	AKL	cmck42pk6001otwsdlv11onid	2025-06-20 02:23:07.213	2025-07-01 06:56:38.765	cmbiwwm9i0004tw0fdfr46otb
cmc46phg0002dtwlkt8tcx2ia	cmc46phdg002btwlk4qi4h997	006066464	XII	TKJT	cmck40wej001atwsdpzxns3dc	2025-06-20 02:22:09.552	2025-07-01 06:58:14.413	cmbiwwm9i0004tw0fdfr46otb
cmc46qufe007xtwlk6y6ld8k6	cmc46qu3i007vtwlkwm0tn9e5	0077232122	XII	AKL	cmck42pk6001otwsdlv11onid	2025-06-20 02:23:13.034	2025-07-01 06:59:34.932	cmbiwwm9i0004tw0fdfr46otb
cmc46uva300mftwlk0yfyi1q9	cmc46uv4p00mbtwlk31zfaph4	0061082601	XII	TKRO	cmck3y53f000stwsdvoovf2pk	2025-06-20 02:26:20.763	2025-07-01 07:02:41.116	cmbiwwm9i0004tw0fdfr46otb
cmc46qwna0089twlkok4h7czv	cmc46qwlm0083twlk4ilu3t7j	0079225312	XII	AKL	cmc48mqk900nxtwlkpuu6o5zz	2025-06-20 02:23:15.91	2025-07-01 07:03:20.805	cmbiwwm9i0004tw0fdfr46otb
cmc46siu100e0twlksoir3qyk	cmc46sioo00dvtwlkw2ke4hmi	0077139336	XII	AKL	cmck3zuvk0010twsdkc3xecuu	2025-06-20 02:24:31.321	2025-07-01 07:08:26.833	cmbiwwm9i0004tw0fdfr46otb
cmc46pl8k002xtwlkrv1parfp	cmc46pl63002vtwlke7a7dfuh	0084685010	XII	TKJT	cmck468tu002ctwsd61d0pz44	2025-06-20 02:22:14.469	2025-07-01 07:08:37.319	cmbiwwm9i0004tw0fdfr46otb
cmc46pmrj0035twlkiohdnxpz	cmc46pmpg0033twlkj8qse4ge	0088688847	XII	TKJT	cmck41lu4001gtwsdh9n41hyu	2025-06-20 02:22:16.447	2025-07-01 07:10:54.229	cmbiwwm9i0004tw0fdfr46otb
cmc46uzp400mttwlk0oazh0s3	cmc46uzf100mrtwlki9mz7bml	0085922169	XII	TKRO	cmck401eu0012twsds1qwqjw4	2025-06-20 02:26:26.488	2025-07-01 07:11:48.371	cmbiwwm9i0004tw0fdfr46otb
cmc46poab003dtwlkkkqtlmi4	cmc46po75003btwlkyt14ipvt	0081947128	XII	TKJT	cmc48mero00nvtwlko7dnse2m	2025-06-20 02:22:18.419	2025-07-01 07:13:38.567	cmbiwwm9i0004tw0fdfr46otb
cmc46ra3i009ktwlk4kxhy7zp	cmc46r9yq009ftwlkhzyupo7f	0082346127	XII	AKL	cmck418fo001etwsdhf12cdrj	2025-06-20 02:23:33.342	2025-07-01 07:13:53.654	cmbiwwm9i0004tw0fdfr46otb
cmc46tw4i00ivtwlkqk6hpr49	cmc46tvz900irtwlk7wcdtj4x	0064649295	XII	TKRO	cmcwpdfml01gytwsdkvaloupy	2025-06-20 02:25:35.202	2025-07-10 01:22:27.33	cmbiwwm9i0004tw0fdfr46otb
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: jurnal_user
--

COPY public.teachers (id, "userId", nip, "createdAt", "updatedAt") FROM stdin;
cmbiwwm9i0004tw0fdfr46otb	cmbiwwm8m0001tw0fgr5lrqgm	198501012010011001	2025-06-05 05:04:36.509	2025-06-05 05:04:36.509
cmbiwwm9s0006tw0f2uni1b74	cmbiwwm8p0002tw0fooxa6vei	198502022010012002	2025-06-05 05:04:36.544	2025-06-05 05:04:36.544
\.


--
-- Data for Name: tempat_pkl; Type: TABLE DATA; Schema: public; Owner: jurnal_user
--

COPY public.tempat_pkl (id, nama, alamat, "createdAt", "updatedAt", "isActive", "pinAbsensi") FROM stdin;
cmck43th1001wtwsd045u0dls	PT. PRADIKSI GUNATAMA	TANAH GROGOT	2025-07-01 05:53:38.259	2025-07-01 12:59:15.375	t	LOJRXJ
tempat2	CV. Digital Kreatif	Jl. Gatot Subroto No. 456, Bandung	2025-06-05 05:04:36.552	2025-06-06 05:57:05.427	t	YKJ5ZW
cmca53cvo00o5twlke9erzxzp	BENGKEL 18 GUNUNG INTAN	GUNUNG INTAN	2025-06-24 06:23:34.644	2025-06-24 06:25:21.964	t	0J2FT9
cmca53uno00o7twlkyp4pdtpz	BENGKEL SIDOREJO	BANPRES BABULU	2025-06-24 06:23:57.684	2025-06-24 06:25:26.373	t	LYEYQK
cmc48rtmy00o1twlk3uhabwd0	KANTOR DESA GUNUNG INTAN	GUNUNG INTAN	2025-06-20 03:19:57.898	2025-06-24 06:25:32.806	t	JTFK24
cmck41zw7001itwsdzw7g387m	KECAMATAN WARU	PENAJAM	2025-07-01 05:52:13.302	2025-07-01 05:52:13.302	t	cmck41zw7001jtwsdz92knp8z
cmck42l6c001mtwsdg14bprmj	KOMISI PEMILIHAN UMUM	PENAJAM	2025-07-01 05:52:40.884	2025-07-01 05:52:40.884	t	cmck42l6c001ntwsd18iqhvny
cmck0igbm0006twsdbpvnfvxz	AUTO 2000 PENAJAM	PENAJAM	2025-07-01 04:13:02.625	2025-07-01 12:08:02.563	t	GV4AVJ
cmck58yj9002itwsdcqhqroi1	BANK BPD BABULU	BABULU	2025-07-01 06:25:37.75	2025-07-01 12:08:35.35	t	BANZU0
cmck0uy49000ctwsdmr363t36	BANK MANDIRI 	BABULU	2025-07-01 04:22:45.56	2025-07-01 12:09:34.831	t	X0Z9Q4
cmck0qlgg0008twsdeysp7xwp	BAPENDA PPU	Penajam	2025-07-01 04:19:22.527	2025-07-01 12:16:04.278	t	ATD1J8
cmck0vjc1000etwsdvou1e2h3	BENGKEL CAHAYA BHAKTI MULYA	BALIKPAPAN BATAKAN	2025-07-01 04:23:13.056	2025-07-01 12:19:14.522	t	TD3F2T
cmck42xch001qtwsdoospemwt	BENGKEL HUDA PENAJAM	PENAJAM	2025-07-01 05:52:56.658	2025-07-01 12:19:40.646	t	C7K4OA
cmck46kxe002etwsdz4vk306h	BENGKEL MOBIL GM KARIANGAU	BALIKPAPAN	2025-07-01 05:55:47.186	2025-07-01 12:21:30.677	t	10V8LA
cmck0w6nf000itwsda5g88e65	BENGKEL SUMBER REJEKI	SESULU	2025-07-01 04:23:43.275	2025-07-01 12:22:08.7	t	SCRN7C
cmck3xw5t000qtwsdwrv2o0ua	BENGKEL VNW	BALIKPAPAN\n	2025-07-01 05:49:01.841	2025-07-01 12:22:37.228	t	PNSXUE
cmck3y53f000stwsdvoovf2pk	CV. AUTO FIT	BALIKPAPAN	2025-07-01 05:49:13.419	2025-07-01 12:24:03.704	t	6Y8BFI
cmco094a600i0twsddog0h3ml	Bengkel Dua Putra Bersaudara	Petung	2025-07-03 23:16:51.821	2025-07-03 23:17:22.504	t	ME7XMB
cmck0hr8y0002twsd7q1cw7g8	DINAS PENANANAMAN MODAL SATU PINTU	PENAJAM	2025-07-01 04:12:30.131	2025-07-01 12:26:49.553	t	9Z8MQ0
cmck3zogi000ytwsdrxv1jqd0	DINAS PUPR PPU	PENAJAM	2025-07-01 05:50:25.17	2025-07-01 12:27:45.175	t	19OTDX
cmck3zuvk0010twsdkc3xecuu	DISDIKPORA PPU	PENAJAM	2025-07-01 05:50:33.487	2025-07-01 12:51:05.911	t	6AMABZ
cmck40i2v0018twsdmoshgxtd	DISDUKCAPIL PPU	PENAJAM	2025-07-01 05:51:03.56	2025-07-01 12:51:24.694	t	0XABA7
cmck3zh9t000wtwsdy9eyy6jv	DISKOMINFO	PENAJAM	2025-07-01 05:50:15.856	2025-07-01 12:51:45.269	t	UVMUWA
cmck41lu4001gtwsdh9n41hyu	DPRD PPU	PENAJAM	2025-07-01 05:51:55.082	2025-07-01 12:52:06.192	t	WGKI6E
cmck401eu0012twsds1qwqjw4	HALLO BENGKEL	BALIKPAPAN	2025-07-01 05:50:41.959	2025-07-01 12:52:27.328	t	AC3XM3
cmck406q40014twsd4gqd9j1a	INDAH JAYA MOTOR	PETUNG	2025-07-01 05:50:48.843	2025-07-01 12:53:25.5	t	7AYWIG
cmck40cr50016twsdir1pcyun	KANTOR BUPATI PPU	PENAJAM	2025-07-01 05:50:56.657	2025-07-01 12:53:39.961	t	G4TLES
cmck40wej001atwsdpzxns3dc	KANTOR DESA BABULU LAUT	BABULU	2025-07-01 05:51:22.121	2025-07-01 12:53:58.767	t	IIVOY7
cmck413cb001ctwsddb4r6abm	KANTOR DESA LABANGKA BARAT 	LABANGKA	2025-07-01 05:51:31.116	2025-07-01 12:54:48.393	t	BSCM7N
cmck418fo001etwsdhf12cdrj	KANTOR DESA LABANGKA	LABANGKA	2025-07-01 05:51:37.716	2025-07-01 12:55:08.91	t	PKODGJ
cmc48mero00nvtwlko7dnse2m	KANTOR DESA BABULU DARAT	DESA BABULU DARAT	2025-06-20 03:15:45.347	2025-07-03 23:38:41.286	t	0SP7W1
cmc48n8mc00nztwlkq8l3p7ok	KANTOR KECAMATAN WARU	KEC. WARU	2025-06-20 03:16:24.037	2025-07-01 12:55:45.471	t	B5UQJQ
cmck42day001ktwsdbcebpkvk	KANTOR PENGADILAN NEGERI PENAJAM PASER UTARA	PENAJAM	2025-07-01 05:52:30.68	2025-07-01 12:55:56.179	t	CYTTN5
cmck448ke0020twsddlrk90by	PT. INDO BISMAR	SURABAYA	2025-07-01 05:53:57.854	2025-07-01 12:57:58.996	t	7NROXR
cmck4dzm8002gtwsdwfchlzo8	KPU PPU	PENAJAM	2025-07-01 06:01:32.816	2025-07-01 12:56:29.135	t	13UORR
cmck42pk6001otwsdlv11onid	KUA BABULU	BABULU	2025-07-01 05:52:46.566	2025-07-01 12:56:47.875	t	RET18Z
cmck439di001utwsdypps76dc	POLRES PPU	PENAJAM	2025-07-01 05:53:12.246	2025-07-01 12:57:01.467	t	WP5JIJ
cmck0vrtn000gtwsdjzf0zz94	PT. GMK	RINTIK PASER	2025-07-01 04:23:24.059	2025-07-01 12:57:13.9	t	BISZMN
cmck461f1002atwsd7hvt6jif	PT. SURYA NET	BABULU	2025-07-01 05:55:21.901	2025-07-06 23:40:12.933	t	20UVCU
cmck44fxi0022twsdqewf2qfz	PT. ITCHI KARTIKA UTAMA	ITCI PENAJAM	2025-07-01 05:54:07.399	2025-07-01 12:58:26.811	t	SARMAK
cmck459zd0024twsdbk2mv6xz	PT. KARUNIA RENTAL INDONESIA	BATU KAJANG\n	2025-07-01 05:54:46.344	2025-07-01 12:58:38.878	t	0MIC3K
cmck45ltr0026twsdhzuwstv3	PTN IV REGIONAL V KEBUN PKS. LONGKALI	MENDIK	2025-07-01 05:55:01.694	2025-07-01 12:58:49.398	t	N170CD
cmck435iu001stwsdbk5h55wi	PT. PERCETAKAN MANUNTUNG PRES	BALIKPAPAN	2025-07-01 05:53:07.254	2025-07-01 12:59:02.782	t	VCZWDQ
cmck440oy001ytwsdh7hdy73b	PT.STN 	BABULU	2025-07-01 05:53:47.651	2025-07-01 12:59:43.276	t	20UVCU
cmck45utb0028twsd8uf3m0ef	RADITYA MOTOR	LONGIKIS	2025-07-01 05:55:13.344	2025-07-01 13:00:08.808	t	KZ38T7
cmck468tu002ctwsd61d0pz44	UPT PU BABULU	BABULU	2025-07-01 05:55:31.506	2025-07-01 13:00:21.63	t	YG2GRT
cmcwpdfml01gytwsdkvaloupy	KLINIK MOBIL BABULU	Gunung Intan	2025-07-10 01:22:12.956	2025-07-10 01:22:42.671	t	J8983R
cmck0tens000atwsdmwj9xk2w	PT. SARANA SUKSES SEJAHTERA	BALIKPAPAN	2025-07-01 04:21:33.687	2025-07-03 00:08:08.786	t	C6ZJ9M
cmck3z3zg000utwsdom83qtzx	DAPM JAYA MANDIRI	BABULU	2025-07-01 05:49:58.635	2025-07-03 00:30:02.99	t	0VBWP4
cmc48mqk900nxtwlkpuu6o5zz	KANTOR KECAMATAN BABULU	KECAMATAN BABULU\n	2025-06-20 03:16:00.632	2025-07-03 00:51:04.167	t	9XMDGY
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: jurnal_user
--

COPY public.users (id, email, name, role, "createdAt", "updatedAt", "passwordHash", username) FROM stdin;
cmbiwwm8b0000tw0futtw2nbd	admin@smkmutu.sch.id	Administrator	ADMIN	2025-06-05 05:04:36.491	2025-06-05 05:04:36.491	$2b$12$/LHS1csWb9wGUfpjKfPT5OXAWx1SvXJNwXXbroaIc.RU7daCh6Gg2	admin
cmbiwwm8m0001tw0fgr5lrqgm	teacher1@smkmutu.sch.id	Budi Santoso	TEACHER	2025-06-05 05:04:36.502	2025-06-05 05:04:36.502	$2b$12$/LHS1csWb9wGUfpjKfPT5OXAWx1SvXJNwXXbroaIc.RU7daCh6Gg2	teacher1
cmbiwwm8p0002tw0fooxa6vei	teacher2@smkmutu.sch.id	Sari Dewi	TEACHER	2025-06-05 05:04:36.506	2025-06-05 05:04:36.506	$2b$12$/LHS1csWb9wGUfpjKfPT5OXAWx1SvXJNwXXbroaIc.RU7daCh6Gg2	teacher2
cmc46qiza006rtwlksqlqsp7j	0078066805@smkmutu.sch.id	Munawaroh	STUDENT	2025-06-20 02:22:58.197	2025-06-20 02:22:58.197	$2b$12$bXANt2vCLCjW5iITnFoUJetZGL4autBo0EROfbA.iRM9DIPsxk07u	0078066805
cmbiwwma9000atw0fl6p2qz9s	student2@smkmutu.sch.id	Budi Setiawan	STUDENT	2025-06-05 05:04:36.561	2025-06-05 05:04:36.561	$2b$12$/LHS1csWb9wGUfpjKfPT5OXAWx1SvXJNwXXbroaIc.RU7daCh6Gg2	student2
cmbiwwmad000btw0fdskxuie6	student3@smkmutu.sch.id	Citra Maharani	STUDENT	2025-06-05 05:04:36.565	2025-06-05 05:04:36.565	$2b$12$/LHS1csWb9wGUfpjKfPT5OXAWx1SvXJNwXXbroaIc.RU7daCh6Gg2	student3
cmc46p4eb000ctwlklxffjw5o	0061941612@smkmutu.sch.id	Ahmad Rizki Pratama	STUDENT	2025-06-20 02:21:52.637	2025-06-20 02:21:52.637	$2b$12$NVbrZL0/nBoRBDwTWP4SGeg0X8DH28RtF5obAkbPD9.nJgMcQtv86	0061941612
cmc46p4uy000ftwlkrsizh2ct	0075506445@smkmutu.sch.id	Cesya Ananda Pratiwi	STUDENT	2025-06-20 02:21:53.242	2025-06-20 02:21:53.242	$2b$12$PKsC2qjvh6FBoHyxoDyKEOl.q9.uYJR6beceCy4Ry88GaBUhonINO	0075506445
cmc46p5b8000itwlkoyi29eyv	0072998707@smkmutu.sch.id	Desi	STUDENT	2025-06-20 02:21:53.829	2025-06-20 02:21:53.829	$2b$12$SRPRkZ3WxvSa3GS3bAPdn.1xlGaVuHg4E1zS1nkAwdGoDIG7r.oGS	0072998707
cmc46p5qi000ltwlk1hkc5x4y	0075746049@smkmutu.sch.id	Desy	STUDENT	2025-06-20 02:21:54.378	2025-06-20 02:21:54.378	$2b$12$JYro847ZGYUuoJ/B1pOJ3OaJHGk16N1fOy8QV8hmGtsX/wfBmY03K	0075746049
cmc46p64d000otwlkh23chiod	0062945172@smkmutu.sch.id	Fauzan Zulkarnain	STUDENT	2025-06-20 02:21:54.877	2025-06-20 02:21:54.877	$2b$12$f3OLObYoxZFTBCDcDkIbg.9FOKdIeNpVKVSIWFs5iIahso0mcE0n6	0062945172
cmc46p6jj000rtwlk91ppbljr	0077360366@smkmutu.sch.id	Ferdelinda Helmalia	STUDENT	2025-06-20 02:21:55.423	2025-06-20 02:21:55.423	$2b$12$RExX6ZzFEdC.uihtIWvhqOKJaUTFCLPvl3kGoJJUxqkP4qDhekBuG	0077360366
cmc46p6yi000utwlk9g4caeus	0084491296@smkmutu.sch.id	Ika Riski Amanda	STUDENT	2025-06-20 02:21:55.959	2025-06-20 02:21:55.959	$2b$12$OyrWnGOqp5Dn2yyH1jijwuQLkkCOxIBm4FJm4HxB2/VxDT6Vyolzq	0084491296
cmc46p7ei000xtwlkji471nyt	0074437909@smkmutu.sch.id	Irgi Ferdiansyah	STUDENT	2025-06-20 02:21:56.538	2025-06-20 02:21:56.538	$2b$12$af38wjK5ffQ88CrhWHCgaOJo8QBbqzTyxKE9OSgSk6PW.7Mz8hP.m	0074437909
cmc46p7xk0010twlkhds62i7n	0067223535@smkmutu.sch.id	Jahriah	STUDENT	2025-06-20 02:21:57.225	2025-06-20 02:21:57.225	$2b$12$BeYj4jhbO736t.yVMui02u7rTX33SI2AklM9abjT3pBDIRLlNv/4G	0067223535
cmc46p8dw0013twlk9f5tbsmz	0074594805@smkmutu.sch.id	Kirana Cinta Mentari	STUDENT	2025-06-20 02:21:57.813	2025-06-20 02:21:57.813	$2b$12$IsPHRMQbPOwRFr3rW/fnZOyrtGravKXN7V79sQ2zKXrkHwz8M4Qm2	0074594805
cmc46r9yq009ftwlkhzyupo7f	0082346127@smkmutu.sch.id	Winda Laura	STUDENT	2025-06-20 02:23:33.17	2025-06-20 02:23:33.17	$2b$12$sd8bBmUInEc6ApDp5tLyq.jb2wGZaxOfQI/CJsIvMydPmb3xI432S	0082346127
cmc46p9b00017twlk1vgawujj	0069718576@smkmutu.sch.id	Linda Febrianti	STUDENT	2025-06-20 02:21:59.004	2025-06-20 02:21:59.004	$2b$12$pS4l7AKJ6bGl2HmDSUT/3.UJ9KRO3KzxB2jURBu2.B/SA01xbzcPS	0069718576
cmc46rtuc00bftwlknoy1bc29	0072944365@smkmutu.sch.id	Dhini Sulistiwati	STUDENT	2025-06-20 02:23:58.932	2025-06-20 02:23:58.932	$2b$12$B.syEXiX3N5ZzICiQijOFuhQXc0WjnSyQoS5KWhyZ8Swfye933PSK	0072944365
cmc46pa58001btwlkmto4zk2o	0086029025@smkmutu.sch.id	Muhammad Arga Ariadi	STUDENT	2025-06-20 02:22:00.092	2025-06-20 02:22:00.092	$2b$12$CQKVK6YSCyppzY2vB0kADeAAnf75vDo9.EI4O9bqsmd3hqb5sc2D6	0086029025
cmc46t3am00fvtwlklpjf26ub	0071683853@smkmutu.sch.id	Apriansyah	STUDENT	2025-06-20 02:24:57.839	2025-06-20 02:24:57.839	$2b$12$SOP6asLbr.sITZNFUec28uLL7l/6BtwwVROMHEwWF2uLx4d65goLS	0071683853
cmc46pb5d001ftwlkdfc9jas6	0068325693@smkmutu.sch.id	Muhammad Ihsan	STUDENT	2025-06-20 02:22:01.394	2025-06-20 02:22:01.394	$2b$12$C.ndaTOvo/guDxdgEUphKO5BnRQXyqRMwCQigoDjLP0FqkNGavixu	0068325693
cmc46pbya001jtwlk6mp1er7g	0089313806@smkmutu.sch.id	Muhammad Yusuf	STUDENT	2025-06-20 02:22:02.434	2025-06-20 02:22:02.434	$2b$12$7ewMO1Aq20sjvZ/0Y2Nh3eqh0XjB/uJdpL3Wx5o7clllr9rUhbhzu	0089313806
cmc46pcsa001ntwlk060savo2	0038700729@smkmutu.sch.id	Mutiara Syifa	STUDENT	2025-06-20 02:22:03.514	2025-06-20 02:22:03.514	$2b$12$J3GLhW7h.jsl8lsEaFaL0O/ZPtq99nEcWA7qewo5O36ZhlH1lNERS	0038700729
cmc46rn9f00artwlkhvcf2cv8	007307992@smkmutu.sch.id	Bunga Cahaya	STUDENT	2025-06-20 02:23:50.403	2025-06-20 02:23:50.403	$2b$12$32WPdehw31n8L1s/xKJdnee1viM/qxwVlWPI4ybfU2CFKF956I12G	007307992
cmc46pdm3001rtwlkvpt18rsv	0081789678@smkmutu.sch.id	Nazhifa Nur Anita	STUDENT	2025-06-20 02:22:04.587	2025-06-20 02:22:04.587	$2b$12$yxfDjncAPHn7oublgxI9mObwHvHx0/7Ju9OSwtV9f0qoCD7B9OhMe	0081789678
cmc46t5hj00g3twlkenbbpi9y	0083213421@smkmutu.sch.id	Choirul Huda	STUDENT	2025-06-20 02:25:00.679	2025-06-20 02:25:00.679	$2b$12$eUAZIEznbLWads6ZL.i6N.zW3mUzUw.d0GPdC6nO8x05/Rnhc4Teq	0083213421
cmc46ped1001vtwlknd3sixtx	0072778880@smkmutu.sch.id	Nazrah Rif'ah	STUDENT	2025-06-20 02:22:05.558	2025-06-20 02:22:05.558	$2b$12$B0C9xF7HLA/WIqZC8AN/4OlQgvThaGOFtfuCcn/uqy8qxouf8iFbq	0072778880
cmc46pf2d001ztwlkao13x2n4	0075907756@smkmutu.sch.id	Novia Anggraini	STUDENT	2025-06-20 02:22:06.469	2025-06-20 02:22:06.469	$2b$12$yQi64v8QFYyggQ1ZZ4EF9OQeV8P5ve9jDypwIPq22jXSyRL01uGmW	0075907756
cmc46pfvx0023twlku4auzv26	0086387057@smkmutu.sch.id	Nur Hikma Aulia	STUDENT	2025-06-20 02:22:07.533	2025-06-20 02:22:07.533	$2b$12$lPJoPOFd5X1X1lKOPufkmuEUH7PGjjf2mInPNr1UcbVyXJYDheREu	0086387057
cmc46pgeu0027twlkbp3fltce	0062997639@smkmutu.sch.id	Nur Lufi hani	STUDENT	2025-06-20 02:22:08.214	2025-06-20 02:22:08.214	$2b$12$WQgzNpXDiH5OKQcXMTjTtOEFkFh4qU9IsYDNm3ZVS0MXILent.6r.	0062997639
cmc46phdg002btwlk4qi4h997	006066464@smkmutu.sch.id	Nurifah	STUDENT	2025-06-20 02:22:09.46	2025-06-20 02:22:09.46	$2b$12$PdCgyckZ2sr4hlZqQE.pyu6iQuPUrJ/wS9qxE4ZRYN2HlN7OYbmYi	006066464
cmc46pi5v002ftwlk2jp5x5to	0066545451@smkmutu.sch.id	Putri Rahayu	STUDENT	2025-06-20 02:22:10.483	2025-06-20 02:22:10.483	$2b$12$oLDx5DBG0fkaEng9nyj41u2r184gt6ADQFYrspvwTjTiOkDyf49bu	0066545451
cmc46pizc002jtwlkctbiz503	0083580156@smkmutu.sch.id	Rahma	STUDENT	2025-06-20 02:22:11.545	2025-06-20 02:22:11.545	$2b$12$FxOxR4ALqIEYcwpkivPc5.0FqDnSd6Sku.CycIYjc/zkgV1EvDuLS	0083580156
cmc46pjny002ntwlk5hhj2h34	0085230985@smkmutu.sch.id	Rasti	STUDENT	2025-06-20 02:22:12.43	2025-06-20 02:22:12.43	$2b$12$SxBqifiIL1VspjxRcKiwYe3ynj48pu3ykKUZ6lazFkoN5qZSZCKsW	0085230985
cmc46pkc3002rtwlkvwh8l35l	0073818403@smkmutu.sch.id	Safirah	STUDENT	2025-06-20 02:22:13.299	2025-06-20 02:22:13.299	$2b$12$hp7qanEYBx28XctUrwyrsu/ymI71RPxi.5uKDNl0SMq0mGweRk4SG	0073818403
cmc46pl63002vtwlke7a7dfuh	0084685010@smkmutu.sch.id	Setiawan Ifan Nur	STUDENT	2025-06-20 02:22:14.38	2025-06-20 02:22:14.38	$2b$12$.L4eaZKUMC4GXppQeZTWG.RVFqHPT5V8RcyLVPQWg.Ozc9xLELmjW	0084685010
cmc46pm0l002ztwlkj5dhutgs	0083961166@smkmutu.sch.id	Sira	STUDENT	2025-06-20 02:22:15.478	2025-06-20 02:22:15.478	$2b$12$w4KvqwlvtgtEocU7rrVPxe5BgG3rZRZ1.dDHNXW0ANSim5BzP3JJe	0083961166
cmc46pmpg0033twlkj8qse4ge	0088688847@smkmutu.sch.id	Sivy Aulia	STUDENT	2025-06-20 02:22:16.372	2025-06-20 02:22:16.372	$2b$12$9bShNIsR.Odlqk2mziYOlOKF71IInA2JeWCJeEBYCez8zoqQWedfq	0088688847
cmc46pnha0037twlkw2s8f57e	0072966140@smkmutu.sch.id	Wahidatul Jannah	STUDENT	2025-06-20 02:22:17.374	2025-06-20 02:22:17.374	$2b$12$KnRlNjHnEF0ruhbYJKQECeTsuB5nuIhBypj/XXPBMMEKC0I1TPPxC	0072966140
cmc46po75003btwlkyt14ipvt	0081947128@smkmutu.sch.id	Widiya Wiwaha	STUDENT	2025-06-20 02:22:18.305	2025-06-20 02:22:18.305	$2b$12$eoxUtodREA4YfuTbDns4U.fn6KOrpEab.Jc7kuZFAOmlE2G9omUsu	0081947128
cmc46pp13003ftwlkobra7cp4	0076358703@smkmutu.sch.id	Zahrotussita Novianti	STUDENT	2025-06-20 02:22:19.382	2025-06-20 02:22:19.382	$2b$12$GpMjFQc9M14vUJkBPyHSa.8SMV6t/mh.svTEnQRzUOvXyt2f0c8ma	0076358703
cmc46ppyv003jtwlk4nj0rn2f	0082639179@smkmutu.sch.id	Tiara Lestari	STUDENT	2025-06-20 02:22:20.599	2025-06-20 02:22:20.599	$2b$12$4thyuAqCITsILDcWbaR2oeyy3sdjkfVHtDacTSUW3coRx0JieGA3.	0082639179
cmc46pqrh003ntwlklvpgi2r9	0083816967@smkmutu.sch.id	Aqila Ramadan	STUDENT	2025-06-20 02:22:21.629	2025-06-20 02:22:21.629	$2b$12$/p7V89FhL7McNYlnF4ReIeKTTQPN73cDQWVtfm0Vjr7d5nCS1yHMC	0083816967
cmc46ub7r00kbtwlk5cwc42lr	0083899328@smkmutu.sch.id	Muhammad Adi Putra	STUDENT	2025-06-20 02:25:54.759	2025-06-20 02:25:54.759	$2b$12$41NXCGTBQy4zTxAlNE5Teuh0KjuMimBevYREYa581.x75x.C9roCm	0083899328
cmc46prjs003rtwlkh7yhaoof	1223111233@smkmutu.sch.id	Abyan Hanif Nurfakih	STUDENT	2025-06-20 02:22:22.647	2025-06-20 02:22:22.647	$2b$12$cwaLcJTGvRU9AVZxZn1LLetK0FoBTuxi2SLtnmR0a5bNa9lqq4b2i	1223111233
cmc46ufv500krtwlke1j3w6wd	0076989808@smkmutu.sch.id	Muhammad Azam Nur Faiq	STUDENT	2025-06-20 02:26:00.785	2025-06-20 02:26:00.785	$2b$12$IJ2haHrScmIHxucYqxw/6ODl0o/luFmdz0mFATe1aW4BpgIuA8uXm	0076989808
cmc46pse7003vtwlk2cod7udq	0089041978@smkmutu.sch.id	Ahmad Fajar	STUDENT	2025-06-20 02:22:23.743	2025-06-20 02:22:23.743	$2b$12$5C53IQrglukTLONDHgCBx.AuzKpVJogLyomkXy.uwt.S.guXbMR2e	0089041978
cmc46ql4s006ztwlk3y86v3zv	0087624050@smkmutu.sch.id	Nasyakul Karimah	STUDENT	2025-06-20 02:23:00.989	2025-06-20 02:23:00.989	$2b$12$OFGtqPfV2ekDKGNFe331V.yzlDokpTwHseght0JbqKHVlneLya4XW	0087624050
cmc46px16004jtwlk3ws5nkk7	0072586104@smkmutu.sch.id	Dina Nur Zulfa	STUDENT	2025-06-20 02:22:29.755	2025-06-20 02:22:29.755	$2b$12$DAaRUZqpBcrzUm7oHFCg7eEzfL01Wu2sFCLdHNDEaPBF.pYreKxuy	0072586104
cmc46pxvf004ntwlk3umo14ka	0087784440@smkmutu.sch.id	Nur Hajizah	STUDENT	2025-06-20 02:22:30.843	2025-06-20 02:22:30.843	$2b$12$B12kRVmAAKMkMyLqoezEv.gdx92mQ7FLa2FvHOnIcPDsZnbYf9fOe	0087784440
cmc46s2sy00cbtwlk494n9stz	0081572630@smkmutu.sch.id	Futri Ani	STUDENT	2025-06-20 02:24:10.546	2025-06-20 02:24:10.546	$2b$12$si6bUhjRnluUd/arI8Nn/eT98xiAiMFDkXuH1Nqk2YoK7iw2sjiQW	0081572630
cmc46pyxh004rtwlkk9w5g06t	0077386388@smkmutu.sch.id	Shera Aulia Desiani	STUDENT	2025-06-20 02:22:32.213	2025-06-20 02:22:32.213	$2b$12$ovVex3CuZGuO3S8XFMkd0Ou0Fdflya/K2oWg8sPoTGRQV1F6kNAEy	0077386388
cmc46q03w004vtwlkbokfxtyy	0081379823@smkmutu.sch.id	Yohanes Cantri Aprian	STUDENT	2025-06-20 02:22:33.74	2025-06-20 02:22:33.74	$2b$12$/1.cUelzpMtMLWwdeNjjcuGNuP/627s1N7.atgMbg.QMxLz3yWAmG	0081379823
cmc46qn9x0077twlkozinetgx	0078651346@smkmutu.sch.id	Nia Ramadani	STUDENT	2025-06-20 02:23:03.765	2025-06-20 02:23:03.765	$2b$12$bDV3pY6ZVyAXjVYmGN43MOQP7ZbczRW1qfotGNBAKHavsfczQbDWa	0078651346
cmc46udd700kjtwlky73yugpy	0087933432@smkmutu.sch.id	Mukhammad Alfarisyi	STUDENT	2025-06-20 02:25:57.548	2025-06-20 02:25:57.548	$2b$12$g7RPrvQ.0JJtvT.2JSlR7OCm86/nVHlen5uBwV6uHsFWlP2fQ9hne	0087933432
cmc46uhzp00kztwlkgz8b3fum	0082585744@smkmutu.sch.id	Muhammad Henri	STUDENT	2025-06-20 02:26:03.541	2025-06-20 02:26:03.541	$2b$12$x2M6dalGkArYRPz3g4vntuIShUFt2/am9SOUnVOcrCJJhpVxBKfuu	0082585744
cmc46qpu6007ftwlk2hyxjqer	0074132977@smkmutu.sch.id	Nur Azizah	STUDENT	2025-06-20 02:23:07.086	2025-06-20 02:23:07.086	$2b$12$GdRXCYFQaIM2ZubeQ9hRSuE1t00Ly9y.DoVbEKwPwgqczX3X3voTS	0074132977
cmc46skv100e3twlkvio5zf3c	0071500674@smkmutu.sch.id	Shintya Rahmania	STUDENT	2025-06-20 02:24:33.949	2025-06-20 02:24:33.949	$2b$12$9GbWJv0d3oW6nQgGl0eDeuQwxX0URcf6B96aZdVbNqbx8nxeiYY8e	0071500674
cmc46uk4100l7twlkw8fmsurt	0092891642@smkmutu.sch.id	Muhammad Iqbal alfarizi	STUDENT	2025-06-20 02:26:06.289	2025-06-20 02:26:06.289	$2b$12$eVPUvM2bgT6.07rEopi/Ku9BCJRfGfWvHQdVJC1qNT6g7gpl2MLzq	0092891642
cmc46q9is005vtwlkicwhgcec	0088209171@smkmutu.sch.id	Dwi Angreani	STUDENT	2025-06-20 02:22:45.94	2025-06-20 02:22:45.94	$2b$12$i.V5aqMVmLkjSwnkn36NMeuMNIYjfDUuxJaR.bB.cqIB/yVQujYk6	0088209171
cmc46qrws007ntwlkth37r9a5	0087472673@smkmutu.sch.id	Olivia Dwi Damayanti	STUDENT	2025-06-20 02:23:09.772	2025-06-20 02:23:09.772	$2b$12$/sclyJJ5lwy25euhVQ9/zucx8m6H/DaQyHJiVl6o694rLjhPxzamu	0087472673
cmc46sn3e00ebtwlkvv02znq5	0082263751@smkmutu.sch.id	Vearesti Putri Arimbi	STUDENT	2025-06-20 02:24:36.843	2025-06-20 02:24:36.843	$2b$12$3sChvH02C6pilME7bLq2MedT2eatI/A4JFQgViJWbok9k.sKC19o.	0082263751
cmc46qc220063twlkt41puyl7	0073903725@smkmutu.sch.id	Felisya Farazeni	STUDENT	2025-06-20 02:22:49.227	2025-06-20 02:22:49.227	$2b$12$KwvGB.JF66IHPiwH.M/iWOP3fpQoeVRI1lkIR//yNU6qC8tKCp5HC	0073903725
cmc46qu3i007vtwlkwm0tn9e5	0077232122@smkmutu.sch.id	Prisca Ayu Savera	STUDENT	2025-06-20 02:23:12.606	2025-06-20 02:23:12.606	$2b$12$zi2IKumGmIithoVIRcgnGOrfQ3AsraWqOSDMdw97GReRvdEKCKDb2	0077232122
cmc46um8w00lftwlkaqc6aq0l	0077976597@smkmutu.sch.id	Muhammad Rama Fadillah	STUDENT	2025-06-20 02:26:09.055	2025-06-20 02:26:09.055	$2b$12$nvqsJpDWjlQGsojyAMkUwO3L09IUw5ouKr1DnR/A.enGq2VxW8ZQu	0077976597
cmc46rwbm00bntwlk5tby5fad	0081609950@smkmutu.sch.id	Dina Aulia Putri	STUDENT	2025-06-20 02:24:02.146	2025-06-20 02:24:02.146	$2b$12$K1S9VntWcadUTyHupqg4lOMKYsjucVXWKUnSAvU2dJ5R7PwjTPwtO	0081609950
cmc46psxp003ztwlkmr3y4uh9	0078950883@smkmutu.sch.id	Ahmad Nur Azis	STUDENT	2025-06-20 02:22:24.445	2025-06-20 02:22:24.445	$2b$12$FFsKsPQjmmXS.Dlbzg4ozOwflAiP/oWovyrl2eQWWEfyO5CGYHARS	0078950883
cmc46ptrw0043twlk9gg4cirh	0088322723@smkmutu.sch.id	Ahmad Richi Firmansyah	STUDENT	2025-06-20 02:22:25.528	2025-06-20 02:22:25.528	$2b$12$g/3dESSfExNB22tF6uiMCOH3qUTCHV/IOTnmXSaAr2fkWNvoaSOxy	0088322723
cmc46puqq0047twlkefyw6mi7	007927892@smkmutu.sch.id	Aidil	STUDENT	2025-06-20 02:22:26.786	2025-06-20 02:22:26.786	$2b$12$Mu3m9esU1R0EXDLaZcT2DexWABIAQAs9HDL3Wi6S.kl2wOq5CnwES	007927892
cmc46pvnd004btwlk0nvv833f	0089123412@smkmutu.sch.id	Ari Sandi Dwi Saputra	STUDENT	2025-06-20 02:22:27.961	2025-06-20 02:22:27.961	$2b$12$gqD/YfjOjrTmrZMgwZ0pJOq2ceLPVqdEgXwPNMkki/sis8yEumVbi	0089123412
cmc46pwh6004gtwlkyfdjw27i	0085689501@smkmutu.sch.id	Desita Maharani	STUDENT	2025-06-20 02:22:29.035	2025-06-20 02:22:29.035	$2b$12$IlNpEWjn1ZcSRg1.vnlaA.XTl80W9B322rvMvCGfv.v6h.UW7neBC	0085689501
cmc46q15j004ztwlk8dvbn3lr	0074394201@smkmutu.sch.id	Ahmad Syazid Syakir	STUDENT	2025-06-20 02:22:35.095	2025-06-20 02:22:35.095	$2b$12$ckFwps78IrR/zL7MX7OjYOUqgM82MZ7JNB372mSAEA/PYsUrDCq6G	0074394201
cmc46q1w90053twlkoiph3n9c	0083974341@smkmutu.sch.id	Maulidar Hidayatullah	STUDENT	2025-06-20 02:22:36.057	2025-06-20 02:22:36.057	$2b$12$UfvEKrf7ekNPD4EzSSn3hOdbGI2tYDjzaEq/XBx6TtBncCKokenoW	0083974341
cmc46q2rf0057twlkxjp764wg	00751327533@smkmutu.sch.id	Muhammad Yusuf	STUDENT	2025-06-20 02:22:37.179	2025-06-20 02:22:37.179	$2b$12$pYX7wOgp76v5Orw9xgyDReh0oGjUCDQi0gjGQKd/7xTUY2WreO.XO	00751327533
cmc46q3ic005btwlki5621cpg	0088730676@smkmutu.sch.id	Ahmad Junaedi	STUDENT	2025-06-20 02:22:38.148	2025-06-20 02:22:38.148	$2b$12$NGcgfk/t.jJhQComIqKoke4GhbioLEC3mZemlHOJ35KSwf8NcVM6G	0088730676
cmc46q56a005ftwlky9ongame	0075590450@smkmutu.sch.id	Arinda Rasya	STUDENT	2025-06-20 02:22:40.306	2025-06-20 02:22:40.306	$2b$12$1kE1ap9wMfLhT/JGL77qLOyIAs9LbF2M3aCrchkTEOgy6JI6c6ZI.	0075590450
cmc46rygd00bvtwlkwst2y7ei	0077805691@smkmutu.sch.id	Elsa Fitriani Wijayanti	STUDENT	2025-06-20 02:24:04.909	2025-06-20 02:24:04.909	$2b$12$.3.gu3wBLiZS.NB58GH7UuaYxj8onjM7v/cGHQ9Y3Jh5qwTbPgX9W	0077805691
cmc46qyr8008btwlkdenct26n	0084853875@smkmutu.sch.id	Sahratul Pathul Jannah	STUDENT	2025-06-20 02:23:18.644	2025-06-20 02:23:18.644	$2b$12$T54qBi86RKaFGMncKm2FgOD0KLlZBrpXflchAxK/cgLHnZX8MDHHC	0084853875
cmc46q7bu005ntwlkatntz1fr	0083742107@smkmutu.sch.id	Ayu Putri arifinaza	STUDENT	2025-06-20 02:22:43.098	2025-06-20 02:22:43.098	$2b$12$DNK4QDZefT/5T2Bh4h.fUOSgm200.xxucwQ9el.rMsWJAsjF22cRe	0083742107
cmc46qe92006ctwlk23frgkcc	0073339824@smkmutu.sch.id	Fitri Anggreini Wardani	STUDENT	2025-06-20 02:22:52.07	2025-06-20 02:22:52.07	$2b$12$g/EgL9TqNZUQozcskDwRi.ZtfunrAwOkuk746XT0nr5O2jHaxGOUu	0073339824
cmc46uqv400lvtwlkll8xzjf4	0076268909@smkmutu.sch.id	Rama Setiawan	STUDENT	2025-06-20 02:26:15.04	2025-06-20 02:26:15.04	$2b$12$vLD0sylZdCghm8XDB3cFGOEuEHQZOdhbe1/nBqWAzp25CvEdmUhLi	0076268909
cmc46r0xd008jtwlksjd4we4h	0081311700@smkmutu.sch.id	Silvia	STUDENT	2025-06-20 02:23:21.457	2025-06-20 02:23:21.457	$2b$12$H9.0CW4xX1Si0EZUuRjOaeKae.NLyyXctr0l1rneX6SSrMNgvIQ5y	0081311700
cmc46s0ma00c3twlk7u5hhkyk	0078932280@smkmutu.sch.id	Eva Aulia Putri	STUDENT	2025-06-20 02:24:07.714	2025-06-20 02:24:07.714	$2b$12$.LhmNfwFjp47ffiZNjSIkeh55hXZqlxXELIJXzXqhslso17z5RSSO	0078932280
cmc46r30r008rtwlkvlh7txua	0071987771@smkmutu.sch.id	Sisti Nurwita Zahra	STUDENT	2025-06-20 02:23:24.171	2025-06-20 02:23:24.171	$2b$12$cOGBHW4BjDntBxIH0jU/Aemw0s6Bazc1YCPZv2ETAc7Z8pijyg1.u	0071987771
cmc46tbvn00grtwlkcff9op0m	0073026438@smkmutu.sch.id	Muh Saimil	STUDENT	2025-06-20 02:25:08.963	2025-06-20 02:25:08.963	$2b$12$gg6TeebAedZhfjGnSpqKperqn6rjaTJDg2eRhPVjGeuxaxrNzp2Vu	0073026438
cmc46r583008ztwlkxhfnmeut	0076742856@smkmutu.sch.id	Siti Desinta Rahmawati	STUDENT	2025-06-20 02:23:27.028	2025-06-20 02:23:27.028	$2b$12$gmgDArkaS2Vc7SgaVByY6enatWa33Un020ENocKOfwcGBT5fdxylC	0076742856
cmc46s59i00cjtwlkelqn8wpc	3072952968@smkmutu.sch.id	Monika	STUDENT	2025-06-20 02:24:13.734	2025-06-20 02:24:13.734	$2b$12$mCJEpi.9XOepBkWfZX3H.Orn98sh02gBhXx9gEqPlTdHJgAD6tQUO	3072952968
cmc46te9000gztwlk9ijdtmox	0075284499@smkmutu.sch.id	Muhammad Akbar	STUDENT	2025-06-20 02:25:12.036	2025-06-20 02:25:12.036	$2b$12$WKIru66C5hBFOp9Sgcp2.u2n.wUfr/hfkjlPlifsXhm0kpFMGtHNG	0075284499
cmc46ut0f00m3twlkqgyhf3hm	0086921143@smkmutu.sch.id	Rehan	STUDENT	2025-06-20 02:26:17.824	2025-06-20 02:26:17.824	$2b$12$nLPsypju8Vox9t7jq2GTa.5Ht53AnrsX3LDIYnWg0DTglk24sNc6q	0086921143
cmc46r7rk0097twlkjoevspif	3088419492@smkmutu.sch.id	Suci Aprilia AA	STUDENT	2025-06-20 02:23:30.321	2025-06-20 02:23:30.321	$2b$12$WwcqMKBttxrDxDsbrGVNFONGzNIpn.4jBexWesWqIoQBjwj5fZhU.	3088419492
cmc46s7gz00crtwlkgxltgsdy	0085429243@smkmutu.sch.id	Nadia	STUDENT	2025-06-20 02:24:16.596	2025-06-20 02:24:16.596	$2b$12$dB1u3l8nF7EdHtUrLpAiZuQjCVfow3uP2izFX8B88ly59D5PjYtE.	0085429243
cmc46tgfh00h7twlkhpaew46m	0076863584@smkmutu.sch.id	Muliyadi	STUDENT	2025-06-20 02:25:14.861	2025-06-20 02:25:14.861	$2b$12$lPKJIPEMl1i1HlHR1d7fhufUPhMC7nm/MARkDq3CJxxMKL6P.FeGK	0076863584
cmc46qwlm0083twlk4ilu3t7j	0079225312@smkmutu.sch.id	Ririn Novitasari	STUDENT	2025-06-20 02:23:15.85	2025-06-20 02:23:15.85	$2b$12$CuD/ntKwv.6gyl4dE7nuweYkdeCHlVJzEb786xtwf5Vjp65UoU1p.	0079225312
cmc46s9p200cztwlk5o0ksh3k	0076597884@smkmutu.sch.id	Naila Rahmadani	STUDENT	2025-06-20 02:24:19.479	2025-06-20 02:24:19.479	$2b$12$d3MuQWOkGgrT/4uCaR/vPeJNrCs/a6Ul0ayGR1.Boj3lq.0FXWgmi	0076597884
cmc46qggs006jtwlka0iwxp7n	0073112408@smkmutu.sch.id	Jumita	STUDENT	2025-06-20 02:22:54.94	2025-06-20 02:22:54.94	$2b$12$O4YGuXoLtbfAv/EMfr7Z1OirpD48OUVVBeCKi3Xm/yEI8XLPL4hcO	0073112408
cmc46t7lg00gbtwlk77gvf3z7	0081232725@smkmutu.sch.id	Jemmy Novarel Fahreza	STUDENT	2025-06-20 02:25:03.412	2025-06-20 02:25:03.412	$2b$12$WePmEQWMsmp4wuN1PkN3r.456NEGaS0u2rTyfLl70.dCVQ1bipnq2	0081232725
cmc46uop800lntwlkg9comfzc	0089803136@smkmutu.sch.id	Muhammad Riswan Nadir	STUDENT	2025-06-20 02:26:12.236	2025-06-20 02:26:12.236	$2b$12$vEp/Y6tzhpkqt4UZ1xbgseRr4aOXVVGz654uTSFVsfMvnMoQP1vMu	0089803136
cmc46sbuo00d7twlkn6u6zkva	0077930827@smkmutu.sch.id	Nur Azizah	STUDENT	2025-06-20 02:24:22.273	2025-06-20 02:24:22.273	$2b$12$7zJmTfJRin2vCgOIfUvt.uuDBo.xvFhcjzynsYcz6jD0lHTwuscy2	0077930827
cmc46t9q900gjtwlketoyds2j	0089181514@smkmutu.sch.id	Jibril Feriski	STUDENT	2025-06-20 02:25:06.178	2025-06-20 02:25:06.178	$2b$12$rsI16imUNK.1/sy.tMFLUeewIjXddVFZeE96QKFQyBnwbu/4la50m	0089181514
cmc46rc5v009ntwlku41soo8q	2112111211@smkmutu.sch.id	Nadiyah	STUDENT	2025-06-20 02:23:36.02	2025-06-20 02:23:36.02	$2b$12$qglFZX3bIdgYTxU2EacWg.2PiUiFVwXk1c4gaOEdsVDiXT1lLQXS6	2112111211
cmc46se2f00dftwlkntz7qmvq	0058328668@smkmutu.sch.id	Oktavia Ramadani	STUDENT	2025-06-20 02:24:25.143	2025-06-20 02:24:25.143	$2b$12$vMPDWzm8RytEU7/eoyeE/uO2ujhVC6ef7K.ucwQOatKb/grRx8tuy	0058328668
cmc46v1wb00mztwlkdty5a2y9	0089274434@smkmutu.sch.id	Zainal Habsyi 	STUDENT	2025-06-20 02:26:29.34	2025-06-20 02:26:29.34	$2b$12$pB0Yqkwcx88Cq31JS0GOPuMZ7u0A7pS5loQ.mVXpxCmbvJRUink4K	0089274434
cmc46rebf009vtwlkl5syd35d	0071200404@smkmutu.sch.id	Abdu Rahmad	STUDENT	2025-06-20 02:23:38.812	2025-06-20 02:23:38.812	$2b$12$Cxm.Jt66lesNhNhrX77EQuEOHLmaxMj7u1glYBSGwarxB/DEvdQWy	0071200404
cmc46sgiw00dntwlkirexb1hm	0077059277@smkmutu.sch.id	Rahma Dani	STUDENT	2025-06-20 02:24:28.328	2025-06-20 02:24:28.328	$2b$12$h4xKdPK2GcZfArqgbcI2re3UJZ.0qKRTo3Iv2vDoi9CElxoUq8pcK	0077059277
cmc46v43i00n7twlkfce7t5ty	0078342659@smkmutu.sch.id	Rouf Fatahillah	STUDENT	2025-06-20 02:26:32.191	2025-06-20 02:26:32.191	$2b$12$zv20Oxs3C.xz2xjsbZLnuOTyNg4TQEzixASXVqGpcMNKMvA9aWC9O	0078342659
cmc46rgfo00a3twlkac8ozm4p	0061405342@smkmutu.sch.id	Adinda Nabila Putri	STUDENT	2025-06-20 02:23:41.556	2025-06-20 02:23:41.556	$2b$12$lUu/g5S99z5EUIYkIwsNJeKge3QpJV5LPxHU1/rhljJIGD7tfVVVC	0061405342
cmc46u70j00jvtwlkdm1zeg8i	0073337225@smkmutu.sch.id	Kharis Alfiansyah	STUDENT	2025-06-20 02:25:49.315	2025-06-20 02:25:49.315	$2b$12$Ys3nQo8rBphVZ5UKTcy0TuVg1c7Wa8MJ1Te22EzaTOFwBiv9OH.la	0073337225
cmc46sioo00dvtwlkw2ke4hmi	0077139336@smkmutu.sch.id	Seftia Rahmadani	STUDENT	2025-06-20 02:24:31.129	2025-06-20 02:24:31.129	$2b$12$CksZB7AQUQlXIkKpCzDH1.2.nQytt6zFeWzmBGWBZp5ZSK3bUii1O	0077139336
cmc46sryp00ertwlk5lx32cio	0088378236@smkmutu.sch.id	Abdul Rahman	STUDENT	2025-06-20 02:24:43.153	2025-06-20 02:24:43.153	$2b$12$D7M.d/ug0iaYGA/3xmCGeuArSrYGghXQhJLRq13sO7tuXHFZ6cQci	0088378236
cmc46rixh00abtwlke3dx7cla	0056118922@smkmutu.sch.id	Artika	STUDENT	2025-06-20 02:23:44.789	2025-06-20 02:23:44.789	$2b$12$CjBf4pr41OuC/Dj9UkSB8umutkDj4bWJCdEJqpZUN2VI01mX9uHW.	0056118922
cmc46v6a600nftwlkujwmtc53	0074149317@smkmutu.sch.id	Hamzah Ramadani	STUDENT	2025-06-20 02:26:35.023	2025-06-20 02:26:35.023	$2b$12$JFVMzLoKdvBSPmsU6/tqguKmiiwS07I2koZ.HsDdBbOvQTrIorSsO	0074149317
cmc46u96c00k3twlk7i3pxz78	0064128213@smkmutu.sch.id	Madhan Priyo Utomo	STUDENT	2025-06-20 02:25:52.116	2025-06-20 02:25:52.116	$2b$12$52Ef9FlmcJfwSIqTM1hvMO0IuTmBLHP4M2OU3rd1AsukBDeZ5C8V6	0064128213
cmc46rl2m00ajtwlknqqunm68	0089825586@smkmutu.sch.id	Ayu Hidayanti	STUDENT	2025-06-20 02:23:47.567	2025-06-20 02:23:47.567	$2b$12$TWQgwDt1dU.lkKs3O5RJl.EUnrF4jJemjRXT8TZ1BXsiDBxkt.cGm	0089825586
cmc46su6k00eztwlktx4kqj4k	0062528799@smkmutu.sch.id	Abdul Rauf	STUDENT	2025-06-20 02:24:46.028	2025-06-20 02:24:46.028	$2b$12$B/H155qb1zeSDWD0QaEkweCGaIi9ciGTMRN9FFJ34XNiSHZd1YeZe	0062528799
cmc46sp9u00ejtwlk16enk2bo	0089617893@smkmutu.sch.id	Irwinsyah	STUDENT	2025-06-20 02:24:39.667	2025-06-20 02:24:39.667	$2b$12$2EUMkkEtmX5ZPCEp.CqXf.531LUUMFKjzm0OAQT5nKAPJfZetKzsa	0089617893
cmc46rpgc00aztwlkv8qw68ap	0086651539@smkmutu.sch.id	Cinta Febriyanti	STUDENT	2025-06-20 02:23:53.244	2025-06-20 02:23:53.244	$2b$12$Kjz.R0cTW.fULkd3A1Qm6.mKDddyOejgjOg7ZdqztCCdMdnGdiPo2	0086651539
cmc46timq00hftwlkp74p6m3a	0072715833@smkmutu.sch.id	Raditya Putra Kurniawan	STUDENT	2025-06-20 02:25:17.714	2025-06-20 02:25:17.714	$2b$12$JWxOeegKPrYV/8NiqUydHucz6NYx2ykwVWiuIPN097IW9GOKZtWmG	0072715833
cmc46uv4p00mbtwlk31zfaph4	0061082601@smkmutu.sch.id	Reihan Septian	STUDENT	2025-06-20 02:26:20.569	2025-06-20 02:26:20.569	$2b$12$pITMwPbj6vjq4epEyUF/JubezOjmVURJLZVDLPO.SgFvgSzoPC0oi	0061082601
cmc46tkri00hntwlknorloih9	0084233136@smkmutu.sch.id	Ragil Wahyudi	STUDENT	2025-06-20 02:25:20.479	2025-06-20 02:25:20.479	$2b$12$TPS55B9mu//ur6hVqSPbVu2U0QBPPF79.ihKKKFmAnA9JV.X.9N6K	0084233136
cmc46ux9300mjtwlkkuypmvev	0076359502@smkmutu.sch.id	Suryawan Rendi Sumantri	STUDENT	2025-06-20 02:26:23.319	2025-06-20 02:26:23.319	$2b$12$igG1NpxwI4ueIsugVIiCQ.AkgkwU02z0qHb5oD0ZXOLJrFJUeVegi	0076359502
cmc46tmxj00hvtwlkd9pf11un	3070510778@smkmutu.sch.id	Rifa Muslimin	STUDENT	2025-06-20 02:25:23.286	2025-06-20 02:25:23.286	$2b$12$DyZqFeilTr3FTpfSomGTL.BUj3YILrF2D8T.33wYap42Wmw/XGeMe	3070510778
cmc46uzf100mrtwlki9mz7bml	0085922169@smkmutu.sch.id	Thoat Hadi	STUDENT	2025-06-20 02:26:26.125	2025-06-20 02:26:26.125	$2b$12$2JO1fV9v6vMqU3vLeDIYj.OhxMxBLBVUdjJqDZiK9qAfy///rOwHu	0085922169
cmc46tp3100i3twlkmmodqo42	0064874677@smkmutu.sch.id	Riswandi	STUDENT	2025-06-20 02:25:26.077	2025-06-20 02:25:26.077	$2b$12$k.QijHoN7TH1TQ6qS1AbKej61NMI014g9ULnaC3n79f.LGKQ99yQa	0064874677
cmc46trme00ibtwlk8l0kz6v3	0088498942@smkmutu.sch.id	Selsi Yunia Tasya	STUDENT	2025-06-20 02:25:29.367	2025-06-20 02:25:29.367	$2b$12$g1kEgCRywk8Orl6QVmobmuvyMgXGlqp8uUxntK5PZbGXzSWxpRo6u	0088498942
cmc46ttrx00ijtwlkwjd2trx9	0077039726@smkmutu.sch.id	Wartadinata Saputra	STUDENT	2025-06-20 02:25:32.157	2025-06-20 02:25:32.157	$2b$12$gxu9Q6WAY1NNXbtn1rPfY.nbcjAEvukqqRbGXES7aeOrc0fDNJdfC	0077039726
cmc46tvz900irtwlk7wcdtj4x	0064649295@smkmutu.sch.id	Imam Hanif Maulana	STUDENT	2025-06-20 02:25:35.013	2025-06-20 02:25:35.013	$2b$12$8kl2TDret8fedJBRIWLmyeVMHjU3.DUWN7RlE.HXpxnRsu1ZETI5.	0064649295
cmc46ty3l00iztwlkxx70so9r	0081265304@smkmutu.sch.id	Ahmad Andreansyah	STUDENT	2025-06-20 02:25:37.761	2025-06-20 02:25:37.761	$2b$12$fGDgC5/HjaazoRFLNdOEw.pWUVcfwwsNNwQCj9kDJHUgCJ.z14fbS	0081265304
cmc46v8gy00nntwlkvik0x106	007116467@smkmutu.sch.id	Marsellino Jibril Mandagi	STUDENT	2025-06-20 02:26:37.859	2025-06-20 02:26:37.859	$2b$12$gVLhwC7zPCO09aNBDRz4uuklkWSRODyQ5AhEZQMfzRiQzMIY6/2dG	007116467
cmc46rrnb00b7twlkv8iwojru	0075544834@smkmutu.sch.id	Desti Damayanti	STUDENT	2025-06-20 02:23:56.087	2025-06-20 02:23:56.087	$2b$12$rsVU7gKisDufHgMdN50IB.y/1RgpR7yYEyRGJwUmJM88.IMTODiQO	0075544834
cmc46swop00f7twlkgrtanzlb	0139336965@smkmutu.sch.id	Ahmad Mahfuri	STUDENT	2025-06-20 02:24:49.274	2025-06-20 02:24:49.274	$2b$12$Znd6YeQBBSNRJcoIopEFyu466tN5JdgsS7.LfdTUnC6EMoNd4Ff5O	0139336965
cmc46sylk00fftwlkshimcgl1	0085600198@smkmutu.sch.id	Aldi	STUDENT	2025-06-20 02:24:51.752	2025-06-20 02:24:51.752	$2b$12$M5n7TT4K67HI61dD9ev9wulM1BAPg/20R32L3NPQFfDMDK5gw6/UK	0085600198
cmc46u07k00j7twlkkzjc1vzj	0086962382@smkmutu.sch.id	Davin Rendra Nugraha	STUDENT	2025-06-20 02:25:40.496	2025-06-20 02:25:40.496	$2b$12$JAMBU2LXfLgMRgw9iEkdP.WToAVXRAcOzPqII3jBHYgHKjFBHP16K	0086962382
cmc46t0rj00fntwlkgtjdwdkk	0085117305@smkmutu.sch.id	Andri Susmiadi	STUDENT	2025-06-20 02:24:54.56	2025-06-20 02:24:54.56	$2b$12$V/tTkL7oLoPy96cLPF8ieujVJRS0V8RUfUEdE4N5bjzm00wa4r0ZG	0085117305
cmc46u2o700jftwlkum4j5udo	0067593618@smkmutu.sch.id	Dede Pratama	STUDENT	2025-06-20 02:25:43.688	2025-06-20 02:25:43.688	$2b$12$wca08ALgufDYwfdbjOVZc.NrHLc8xbvY2TF5Gldt.rieVPA8TIeVG	0067593618
cmc46u4uf00jntwlk6i894665	0074048858@smkmutu.sch.id	Fanni Saputri	STUDENT	2025-06-20 02:25:46.503	2025-06-20 02:25:46.503	$2b$12$flBHWnvDgy1dVg0xiEaSKuC7KXTUqUsKYbyUGp.iApXvb7PTzeTRK	0074048858
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: absensis absensis_pkey; Type: CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.absensis
    ADD CONSTRAINT absensis_pkey PRIMARY KEY (id);


--
-- Name: jurnal_comments jurnal_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.jurnal_comments
    ADD CONSTRAINT jurnal_comments_pkey PRIMARY KEY (id);


--
-- Name: jurnals jurnals_pkey; Type: CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.jurnals
    ADD CONSTRAINT jurnals_pkey PRIMARY KEY (id);


--
-- Name: setting_absensis setting_absensis_pkey; Type: CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.setting_absensis
    ADD CONSTRAINT setting_absensis_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: tempat_pkl tempat_pkl_pkey; Type: CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.tempat_pkl
    ADD CONSTRAINT tempat_pkl_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: absensis_studentId_tanggal_tipe_key; Type: INDEX; Schema: public; Owner: jurnal_user
--

CREATE UNIQUE INDEX "absensis_studentId_tanggal_tipe_key" ON public.absensis USING btree ("studentId", tanggal, tipe);


--
-- Name: jurnals_studentId_tanggal_key; Type: INDEX; Schema: public; Owner: jurnal_user
--

CREATE UNIQUE INDEX "jurnals_studentId_tanggal_key" ON public.jurnals USING btree ("studentId", tanggal);


--
-- Name: setting_absensis_tempatPklId_key; Type: INDEX; Schema: public; Owner: jurnal_user
--

CREATE UNIQUE INDEX "setting_absensis_tempatPklId_key" ON public.setting_absensis USING btree ("tempatPklId");


--
-- Name: students_nisn_key; Type: INDEX; Schema: public; Owner: jurnal_user
--

CREATE UNIQUE INDEX students_nisn_key ON public.students USING btree (nisn);


--
-- Name: students_userId_key; Type: INDEX; Schema: public; Owner: jurnal_user
--

CREATE UNIQUE INDEX "students_userId_key" ON public.students USING btree ("userId");


--
-- Name: teachers_nip_key; Type: INDEX; Schema: public; Owner: jurnal_user
--

CREATE UNIQUE INDEX teachers_nip_key ON public.teachers USING btree (nip);


--
-- Name: teachers_userId_key; Type: INDEX; Schema: public; Owner: jurnal_user
--

CREATE UNIQUE INDEX "teachers_userId_key" ON public.teachers USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: jurnal_user
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: jurnal_user
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: absensis absensis_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.absensis
    ADD CONSTRAINT "absensis_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: absensis absensis_tempatPklId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.absensis
    ADD CONSTRAINT "absensis_tempatPklId_fkey" FOREIGN KEY ("tempatPklId") REFERENCES public.tempat_pkl(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: jurnal_comments jurnal_comments_jurnalId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.jurnal_comments
    ADD CONSTRAINT "jurnal_comments_jurnalId_fkey" FOREIGN KEY ("jurnalId") REFERENCES public.jurnals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: jurnal_comments jurnal_comments_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.jurnal_comments
    ADD CONSTRAINT "jurnal_comments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: jurnals jurnals_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.jurnals
    ADD CONSTRAINT "jurnals_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: setting_absensis setting_absensis_tempatPklId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.setting_absensis
    ADD CONSTRAINT "setting_absensis_tempatPklId_fkey" FOREIGN KEY ("tempatPklId") REFERENCES public.tempat_pkl(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: students students_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: students students_tempatPklId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_tempatPklId_fkey" FOREIGN KEY ("tempatPklId") REFERENCES public.tempat_pkl(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: students students_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teachers teachers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jurnal_user
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

