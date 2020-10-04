DROP TABLE IF EXISTS "urls";

--
-- TOC entry 189 (class 1259 OID 16568)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "urls" (
    id integer NOT NULL,
    longurl text NOT NULL,
    shorturl text NOT NULL    
);


ALTER TABLE "urls" OWNER TO postgres;

--
-- TOC entry 190 (class 1259 OID 16574)
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "urls_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "urls_id_seq" OWNER TO postgres;

--
-- TOC entry 2180 (class 0 OID 0)
-- Dependencies: 190
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "urls_id_seq" OWNED BY urls.id;


--
-- TOC entry 2054 (class 2604 OID 16617)
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "urls" ALTER COLUMN id SET DEFAULT nextval('"urls_id_seq"'::regclass);
