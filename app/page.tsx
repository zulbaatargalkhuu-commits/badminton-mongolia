"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";

type Role = "club" | "regional" | "admin";
type PageKey =
  | "dashboard"
  | "athletes"
  | "entries"
  | "compose"
  | "pairings"
  | "tournaments"
  | "rankings"
  | "results"
  | "export"
  | "notifications"
  | "users";
type Lang = "en" | "mn";

type User = {
  id: string;
  password: string;
  role: Role;
  name: string;
  nameMn: string;
  short: string;
  region: string;
  color: string;
};

type Athlete = {
  id: string;
  no: string;
  lastName: string;
  firstName: string;
  gender: "M" | "F";
  club: string;
  clubId: string;
  region: string;
  events: string;
  status: "active" | "pending";
  dob: string;
  email: string;
};

type Entry = {
  id: string;
  clubId: string;
  clubName: string;
  athleteId: string;
  athleteName: string;
  no: string;
  tournamentId: string;
  tournament: string;
  category: string;
  date: string;
  status: "confirmed" | "pending" | "rejected";
};

type Pairing = {
  id: string;
  fromClubId: string;
  fromClub: string;
  toClubId: string;
  toClub: string;
  athleteName: string;
  category: string;
  tournament: string;
  status: "pending" | "accepted" | "rejected";
};

type RankingRow = {
  rank: number;
  previous: number;
  no: string;
  name: string;
  club: string;
  events: number;
  points: number;
};

type Tournament = {
  id: string;
  name: string;
  nameMn: string;
  date: string;
  venue: string;
  status: "live" | "open" | "upcoming";
  categories: string[];
};

const users: Record<string, User> = {
  "CLUB-0042": {
    id: "CLUB-0042",
    password: "shuttle2026",
    role: "club",
    name: "Ulaanbaatar BC",
    nameMn: "Улаанбаатар БК",
    short: "UBC",
    region: "Central",
    color: "#173f8f",
  },
  "CLUB-0017": {
    id: "CLUB-0017",
    password: "darkhan2026",
    role: "club",
    name: "Darkhan BC",
    nameMn: "Дархан БК",
    short: "DBC",
    region: "North",
    color: "#166a4d",
  },
  "REG-NORTH": {
    id: "REG-NORTH",
    password: "regnorth26",
    role: "regional",
    name: "Northern Regional Association",
    nameMn: "Хойд бүсийн холбоо",
    short: "NRA",
    region: "North",
    color: "#7a4e00",
  },
  "ADMIN-001": {
    id: "ADMIN-001",
    password: "mbaadmin26",
    role: "admin",
    name: "MBA Administration",
    nameMn: "МБХ Захиргаа",
    short: "MBA",
    region: "HQ",
    color: "#8f2530",
  },
};

const tournaments: Tournament[] = [
  {
    id: "T001",
    name: "National Championship 2026",
    nameMn: "Улсын аварга 2026",
    date: "26 May 2026",
    venue: "National Sports Palace, Ulaanbaatar",
    status: "live",
    categories: ["MS A", "WS A", "MD A", "WD A", "XD A", "MS B", "WS B"],
  },
  {
    id: "T002",
    name: "Northern Regional Open 2026",
    nameMn: "Хойд бүсийн нээлттэй 2026",
    date: "22 July 2026",
    venue: "Darkhan Sports Palace",
    status: "open",
    categories: ["MS", "WS", "MD", "WD", "XD"],
  },
  {
    id: "T003",
    name: "Junior Development Championship",
    nameMn: "Залуучуудын хөгжлийн аварга",
    date: "9 August 2026",
    venue: "Erdenet Sports Complex",
    status: "open",
    categories: ["U13", "U15", "U17", "U19"],
  },
  {
    id: "T004",
    name: "Mixed Doubles Cup",
    nameMn: "Холимог хосын цом",
    date: "20 September 2026",
    venue: "UB Sports Hall",
    status: "upcoming",
    categories: ["XD"],
  },
];

const seedAthletes: Athlete[] = [
  {
    id: "A001",
    no: "35",
    lastName: "Altangerel",
    firstName: "Gantumur",
    gender: "M",
    club: "Ulaanbaatar BC",
    clubId: "CLUB-0042",
    region: "Central",
    events: "MS B, MD B",
    status: "active",
    dob: "2001-02-14",
    email: "gantumur@example.mn",
  },
  {
    id: "A002",
    no: "111",
    lastName: "Byambatsogt",
    firstName: "Khaliunaa",
    gender: "F",
    club: "Ulaanbaatar BC",
    clubId: "CLUB-0042",
    region: "Central",
    events: "WS A, XD A",
    status: "active",
    dob: "1999-09-11",
    email: "khaliunaa@example.mn",
  },
  {
    id: "A003",
    no: "29",
    lastName: "Ganzorig",
    firstName: "Tsend-Ayush",
    gender: "M",
    club: "Ulaanbaatar BC",
    clubId: "CLUB-0042",
    region: "Central",
    events: "MS A, MD A, XD A",
    status: "active",
    dob: "1997-05-04",
    email: "ganzorig@example.mn",
  },
  {
    id: "A004",
    no: "33",
    lastName: "Erdenechuluun",
    firstName: "Tungalagtamir",
    gender: "F",
    club: "Ulaanbaatar BC",
    clubId: "CLUB-0042",
    region: "Central",
    events: "WS A, WD A",
    status: "pending",
    dob: "2004-03-27",
    email: "tungalagtamir@example.mn",
  },
  {
    id: "A005",
    no: "115",
    lastName: "Ariuntsogt",
    firstName: "Munguntsooj",
    gender: "M",
    club: "Darkhan BC",
    clubId: "CLUB-0017",
    region: "North",
    events: "MS A, MD A",
    status: "active",
    dob: "1998-01-16",
    email: "munguntsooj@example.mn",
  },
  {
    id: "A006",
    no: "114",
    lastName: "Khishigchuluun",
    firstName: "Temuulen",
    gender: "M",
    club: "Darkhan BC",
    clubId: "CLUB-0017",
    region: "North",
    events: "MD A, XD A",
    status: "active",
    dob: "2000-06-08",
    email: "temuulen@example.mn",
  },
  {
    id: "A007",
    no: "97",
    lastName: "Boldbaatar",
    firstName: "Tuguldur",
    gender: "M",
    club: "Gobi BC",
    clubId: "CLUB-0051",
    region: "South",
    events: "MS A, MD A",
    status: "active",
    dob: "1996-12-18",
    email: "tuguldur@example.mn",
  },
  {
    id: "A008",
    no: "99",
    lastName: "Bayasgalan",
    firstName: "Arvinbuyan",
    gender: "F",
    club: "Gobi BC",
    clubId: "CLUB-0051",
    region: "South",
    events: "WS A, XD A",
    status: "active",
    dob: "2002-10-02",
    email: "arvinbuyan@example.mn",
  },
  {
    id: "A009",
    no: "7",
    lastName: "Sansarbaatar",
    firstName: "Khulan",
    gender: "F",
    club: "Dornod Eagles",
    clubId: "CLUB-0062",
    region: "East",
    events: "WS A, WD A",
    status: "active",
    dob: "2003-07-19",
    email: "khulan@example.mn",
  },
];

const seedEntries: Entry[] = [
  {
    id: "E001",
    clubId: "CLUB-0042",
    clubName: "Ulaanbaatar BC",
    athleteId: "A001",
    athleteName: "Altangerel Gantumur",
    no: "35",
    tournamentId: "T001",
    tournament: "National Championship 2026",
    category: "MS B",
    date: "2026-05-10",
    status: "confirmed",
  },
  {
    id: "E002",
    clubId: "CLUB-0042",
    clubName: "Ulaanbaatar BC",
    athleteId: "A002",
    athleteName: "Byambatsogt Khaliunaa",
    no: "111",
    tournamentId: "T001",
    tournament: "National Championship 2026",
    category: "WS A",
    date: "2026-05-10",
    status: "confirmed",
  },
  {
    id: "E003",
    clubId: "CLUB-0017",
    clubName: "Darkhan BC",
    athleteId: "A005",
    athleteName: "Ariuntsogt Munguntsooj",
    no: "115",
    tournamentId: "T001",
    tournament: "National Championship 2026",
    category: "MS A",
    date: "2026-05-11",
    status: "pending",
  },
  {
    id: "E004",
    clubId: "CLUB-0042",
    clubName: "Ulaanbaatar BC",
    athleteId: "A003",
    athleteName: "Ganzorig Tsend-Ayush",
    no: "29",
    tournamentId: "T002",
    tournament: "Northern Regional Open 2026",
    category: "MS",
    date: "2026-06-02",
    status: "pending",
  },
];

const seedPairings: Pairing[] = [
  {
    id: "P001",
    fromClubId: "CLUB-0042",
    fromClub: "Ulaanbaatar BC",
    toClubId: "CLUB-0017",
    toClub: "Darkhan BC",
    athleteName: "Khishigchuluun Temuulen",
    category: "XD A",
    tournament: "National Championship 2026",
    status: "pending",
  },
];

const seedRankings: Record<string, RankingRow[]> = {
  ms: [
    {
      rank: 1,
      previous: 1,
      no: "29",
      name: "Ganzorig Tsend-Ayush",
      club: "Ulaanbaatar BC",
      events: 18,
      points: 9840,
    },
    {
      rank: 2,
      previous: 3,
      no: "115",
      name: "Ariuntsogt Munguntsooj",
      club: "Darkhan BC",
      events: 16,
      points: 8760,
    },
    {
      rank: 3,
      previous: 2,
      no: "97",
      name: "Boldbaatar Tuguldur",
      club: "Gobi BC",
      events: 15,
      points: 8120,
    },
    {
      rank: 4,
      previous: 4,
      no: "35",
      name: "Altangerel Gantumur",
      club: "Ulaanbaatar BC",
      events: 13,
      points: 7040,
    },
  ],
  ws: [
    {
      rank: 1,
      previous: 1,
      no: "111",
      name: "Byambatsogt Khaliunaa",
      club: "Ulaanbaatar BC",
      events: 17,
      points: 9210,
    },
    {
      rank: 2,
      previous: 2,
      no: "33",
      name: "Erdenechuluun Tungalagtamir",
      club: "Ulaanbaatar BC",
      events: 15,
      points: 8440,
    },
    {
      rank: 3,
      previous: 4,
      no: "7",
      name: "Sansarbaatar Khulan",
      club: "Dornod Eagles",
      events: 14,
      points: 7980,
    },
    {
      rank: 4,
      previous: 3,
      no: "99",
      name: "Bayasgalan Arvinbuyan",
      club: "Gobi BC",
      events: 13,
      points: 7120,
    },
  ],
  md: [
    {
      rank: 1,
      previous: 1,
      no: "29+35",
      name: "Ganzorig / Altangerel",
      club: "Ulaanbaatar BC",
      events: 14,
      points: 8920,
    },
    {
      rank: 2,
      previous: 2,
      no: "115+114",
      name: "Ariuntsogt / Khishigchuluun",
      club: "Darkhan BC",
      events: 12,
      points: 7840,
    },
  ],
  xd: [
    {
      rank: 1,
      previous: 1,
      no: "29+111",
      name: "Ganzorig / Byambatsogt",
      club: "Ulaanbaatar BC",
      events: 15,
      points: 8760,
    },
    {
      rank: 2,
      previous: 2,
      no: "97+99",
      name: "Boldbaatar / Bayasgalan",
      club: "Gobi BC",
      events: 13,
      points: 7920,
    },
  ],
};

const copy = {
  en: {
    publicTitle: "Mongolian Badminton Association",
    publicSubtitle: "News, national rankings, tournament calendar, athlete registration, club development, and competition services for badminton in Mongolia.",
    register: "Register athlete",
    login: "Portal login",
    signIn: "Sign in",
    signInPortal: "Sign in to portal",
    account: "Account",
    password: "Password",
    news: "News",
    about: "About",
    clubs: "Clubs",
    portal: "Portal",
    contact: "Contact",
    rankings: "Rankings",
    tournaments: "Tournaments",
    dashboard: "Dashboard",
    athletes: "Athletes",
    entries: "Entries",
    compose: "Entry compose",
    pairings: "Pairings",
    results: "Results",
    export: "Export",
    notifications: "Notifications",
    users: "Users",
    officialAssociation: "Official national association",
    viewTournaments: "View tournaments",
    clubAdminPortal: "Club/Admin portal",
    latestUpdates: "Latest updates",
    newsAnnouncements: "News and announcements",
    submitClubUpdate: "Submit club update",
    aboutMba: "About MBA",
    aboutHeadline: "Growing badminton from school courts to national finals.",
    aboutBody: "MBA supports athletes, clubs, coaches, officials, and regional associations with a single national competition structure. Public visitors can follow events and rankings here, while clubs use the portal for official entries and administration.",
    nationalStandings: "National standings",
    currentRankings: "Current rankings",
    registeredAthletes: "Registered athletes",
    playerSpotlight: "Player spotlight",
    competitionCalendar: "Competition calendar",
    upcomingTournaments: "Upcoming tournaments",
    memberNetwork: "Member network",
    clubsRegions: "Clubs and regions",
    contactHeadline: "Join the national badminton network.",
    contactBody: "Clubs can request affiliation, confirm tournaments, and coordinate coaching or officiating programs through the MBA office.",
    portalHeadline: "Secure access for official competition work.",
    portalBody: "This area is for club secretaries, regional associations, and MBA administrators. The public website remains available above without signing in.",
    demoCredentials: "Demo credentials are prefilled for preview.",
    footerLinks: "News / Rankings / Tournaments / Clubs / Portal",
    operationsOverview: "Operations overview",
    newEntry: "New entry",
    uploadResult: "Upload result",
    athletesLabel: "Athletes",
    pendingReview: "Pending review",
    awaitingAction: "awaiting action",
    activeDetail: "active",
    confirmedDetail: "confirmed",
    msLeader: "MS leader",
    tournamentWorkflow: "Tournament workflow",
    pendingEntries: "Pending entries",
    recentEntries: "Recent entries",
    athleteApprovals: "Athlete approvals",
    registry: "Registry",
    approve: "Approve",
    reject: "Reject",
    activate: "Activate",
    ready: "Ready",
    reviewed: "Reviewed",
    searchApproval: "Search and approval",
    athleteRegistry: "Athlete registry",
    searchAthlete: "Search name, club, or number",
    allStatus: "All status",
    status: "Status",
    action: "Action",
    region: "Region",
    events: "Events",
    club: "Club",
    athlete: "Athlete",
    tournament: "Tournament",
    category: "Category",
    date: "Date",
    review: "Review",
    entryComposeTitle: "BWF-style entry compose",
    tournamentEntry: "Tournament entry",
    selectAthlete: "Select athlete",
    doublesNote: "Doubles categories allow cross-club athletes and create a pairing request for the partner club.",
    submitEntry: "Submit entry",
    approvalQueue: "Approval queue",
    incomingRequests: "Incoming requests",
    sentRequests: "Sent requests",
    partnerApproval: "Partner approval",
    crossClubDoubles: "Cross-club doubles",
    noPairingRequests: "No pairing requests.",
    accept: "Accept",
    competitionEntriesVenues: "Entries and venues",
    rankingEngine: "Ranking engine",
    rankingRules: "Ranking rules",
    points: "Points",
    updateRankings: "Update rankings",
    resultRule1: "Each uploaded result adds event participation and points to the athlete or pair.",
    resultRule2: "Ranking tables are recalculated immediately and preserve previous rank movement.",
    resultRule3: "Export files remain compatible with tournamentsoftware.com import workflows.",
    tsExportTitle: "Tournament software export",
    tsCompatible: "TS-compatible files",
    playerList: "Player list",
    activeAthletesExport: "active athletes in BWF-style tab-separated format.",
    downloadPlayers: "Download players",
    confirmedEntries: "Confirmed entries",
    confirmedEntriesExport: "confirmed entries ready for tournament import.",
    downloadEntries: "Download entries",
    associationMessaging: "Association messaging",
    recipients: "Recipients",
    allClubsAssociations: "All clubs and associations",
    clubsOnly: "Clubs only",
    regionalAssociations: "Regional associations",
    title: "Title",
    message: "Message",
    messageTitlePlaceholder: "Message title",
    messagePlaceholder: "Write a short operational update",
    sendNotification: "Send notification",
    userAdministration: "User administration",
    clubsRegionalAccounts: "Clubs and regional accounts",
    resetPassword: "Reset password",
    signOut: "Sign out",
    lastName: "Last name",
    firstName: "First name",
    gender: "Gender",
    dateOfBirth: "Date of birth",
    email: "Email",
    familyName: "Family name",
    givenName: "Given name",
    submitRegistration: "Submit registration",
    cancel: "Cancel",
    registrationNote: "Registration creates a pending profile for MBA office approval.",
    rank: "Rank",
    move: "Move",
    name: "Name",
    number: "No.",
    roleClub: "Club",
    roleRegional: "Regional",
    roleAdmin: "Admin",
    signedOut: "Signed out.",
    invalidCredentials: "Invalid credentials.",
    welcome: "Welcome",
    athleteRegistrationSubmitted: "Athlete registration submitted.",
    entryConfirmed: "Entry confirmed.",
    entryUpdated: "Entry updated.",
    pairingAccepted: "Pairing accepted.",
    pairingUpdated: "Pairing updated.",
    athleteActivated: "Athlete activated.",
    entryCrossClub: "Entry saved and pairing request sent.",
    entrySubmitted: "Entry submitted for approval.",
    resultAdded: "Result added and rankings recalculated.",
    playersExportDownloaded: "Players export downloaded.",
    entriesExportDownloaded: "Entries export downloaded.",
    notificationSent: "Notification sent.",
    passwordResetStaged: "Password reset staged for",
    registeredAthleteCount: "registered athletes",
    regionSuffix: "region",
    activeAthletesMetric: "Active athletes",
    memberClubsMetric: "Member clubs",
    openEventsMetric: "Open events",
    confirmedEntriesMetric: "Confirmed entries",
    eventsCount: "events",
  },
  mn: {
    publicTitle: "Монголын Бадминтоны Холбоо",
    publicSubtitle: "Монголын бадминтоны мэдээ, улсын чансаа, тэмцээний хуваарь, тамирчны бүртгэл, клубын хөгжил, тэмцээний үйлчилгээ.",
    register: "Тамирчин бүртгэх",
    login: "Портал нэвтрэх",
    signIn: "Нэвтрэх",
    signInPortal: "Порталд нэвтрэх",
    account: "Хаяг",
    password: "Нууц үг",
    news: "Мэдээ",
    about: "Бидний тухай",
    clubs: "Клубууд",
    portal: "Портал",
    contact: "Холбоо барих",
    rankings: "Чансаа",
    tournaments: "Тэмцээн",
    dashboard: "Хянах самбар",
    athletes: "Тамирчид",
    entries: "Бүртгэлүүд",
    compose: "Тэмцээнд бүртгэх",
    pairings: "Хосын хүсэлт",
    results: "Үр дүн",
    export: "Экспорт",
    notifications: "Мэдэгдэл",
    users: "Хэрэглэгчид",
    officialAssociation: "Үндэсний албан ёсны холбоо",
    viewTournaments: "Тэмцээн харах",
    clubAdminPortal: "Клуб/Админ портал",
    latestUpdates: "Сүүлийн шинэчлэл",
    newsAnnouncements: "Мэдээ, зарлал",
    submitClubUpdate: "Клубын мэдээ илгээх",
    aboutMba: "МБХ-ны тухай",
    aboutHeadline: "Сургуулийн заалнаас улсын финал хүртэл бадминтоныг хөгжүүлнэ.",
    aboutBody: "МБХ нь тамирчин, клуб, дасгалжуулагч, шүүгч, бүсийн холбоодыг үндэсний нэг бүтэцтэй тэмцээний системээр дэмждэг. Олон нийт эндээс тэмцээн, чансааг харж, клубууд порталаар албан бүртгэл, зохион байгуулалтаа хийнэ.",
    nationalStandings: "Улсын чансаа",
    currentRankings: "Одоогийн чансаа",
    registeredAthletes: "Бүртгэлтэй тамирчид",
    playerSpotlight: "Тамирчны онцлох жагсаалт",
    competitionCalendar: "Тэмцээний хуваарь",
    upcomingTournaments: "Удахгүй болох тэмцээнүүд",
    memberNetwork: "Гишүүн байгууллагууд",
    clubsRegions: "Клуб ба бүсүүд",
    contactHeadline: "Үндэсний бадминтоны сүлжээнд нэгдээрэй.",
    contactBody: "Клубууд гишүүнчлэл хүсэх, тэмцээн баталгаажуулах, дасгалжуулалт болон шүүлтийн хөтөлбөрөө МБХ-ны оффистой зохицуулна.",
    portalHeadline: "Албан тэмцээний ажлын хамгаалалттай нэвтрэлт.",
    portalBody: "Энэ хэсэг нь клубын нарийн бичиг, бүсийн холбоо, МБХ-ны администраторуудад зориулагдсан. Олон нийтийн сайт дээрх мэдээлэл нэвтрэхгүйгээр нээлттэй байна.",
    demoCredentials: "Туршилтын нэвтрэх мэдээлэл урьдчилан бөглөгдсөн.",
    footerLinks: "Мэдээ / Чансаа / Тэмцээн / Клуб / Портал",
    operationsOverview: "Үйл ажиллагааны тойм",
    newEntry: "Шинэ бүртгэл",
    uploadResult: "Үр дүн оруулах",
    athletesLabel: "Тамирчид",
    pendingReview: "Хүлээгдэж буй",
    awaitingAction: "үйлдэл хүлээж байна",
    activeDetail: "идэвхтэй",
    confirmedDetail: "баталгаажсан",
    msLeader: "Эрэгтэй ганцаарчилсан тэргүүлэгч",
    tournamentWorkflow: "Тэмцээний урсгал",
    pendingEntries: "Хянах бүртгэлүүд",
    recentEntries: "Сүүлийн бүртгэлүүд",
    athleteApprovals: "Тамирчны баталгаажуулалт",
    registry: "Мэдээллийн сан",
    approve: "Зөвшөөрөх",
    reject: "Татгалзах",
    activate: "Идэвхжүүлэх",
    ready: "Бэлэн",
    reviewed: "Хянагдсан",
    searchApproval: "Хайлт ба баталгаажуулалт",
    athleteRegistry: "Тамирчны бүртгэл",
    searchAthlete: "Нэр, клуб эсвэл дугаараар хайх",
    allStatus: "Бүх төлөв",
    status: "Төлөв",
    action: "Үйлдэл",
    region: "Бүс",
    events: "Төрөл",
    club: "Клуб",
    athlete: "Тамирчин",
    tournament: "Тэмцээн",
    category: "Ангилал",
    date: "Огноо",
    review: "Хянах",
    entryComposeTitle: "BWF загварын тэмцээний бүртгэл",
    tournamentEntry: "Тэмцээний бүртгэл",
    selectAthlete: "Тамирчин сонгох",
    doublesNote: "Хосын ангилалд өөр клубын тамирчин сонгоход тухайн клуб руу хосын хүсэлт илгээгдэнэ.",
    submitEntry: "Бүртгэл илгээх",
    approvalQueue: "Баталгаажуулах жагсаалт",
    incomingRequests: "Ирсэн хүсэлтүүд",
    sentRequests: "Илгээсэн хүсэлтүүд",
    partnerApproval: "Түншийн баталгаажуулалт",
    crossClubDoubles: "Клуб хоорондын хос",
    noPairingRequests: "Хосын хүсэлт байхгүй.",
    accept: "Зөвшөөрөх",
    competitionEntriesVenues: "Бүртгэл ба заал",
    rankingEngine: "Чансааны тооцоолол",
    rankingRules: "Чансааны дүрэм",
    points: "Оноо",
    updateRankings: "Чансаа шинэчлэх",
    resultRule1: "Оруулсан үр дүн бүр тамирчин эсвэл хосын тэмцээнд оролцсон тоо, оноог нэмнэ.",
    resultRule2: "Чансааны хүснэгт шууд дахин тооцоологдож өмнөх байрны өөрчлөлтийг хадгална.",
    resultRule3: "Экспортын файлууд tournamentsoftware.com импортын урсгалтай нийцнэ.",
    tsExportTitle: "Тэмцээний програмын экспорт",
    tsCompatible: "TS форматтай файлууд",
    playerList: "Тамирчдын жагсаалт",
    activeAthletesExport: "идэвхтэй тамирчин BWF маягийн табаар тусгаарласан форматтай.",
    downloadPlayers: "Тамирчид татах",
    confirmedEntries: "Баталгаажсан бүртгэл",
    confirmedEntriesExport: "баталгаажсан бүртгэл тэмцээний импортод бэлэн.",
    downloadEntries: "Бүртгэл татах",
    associationMessaging: "Холбооны мэдэгдэл",
    recipients: "Хүлээн авагчид",
    allClubsAssociations: "Бүх клуб ба холбоод",
    clubsOnly: "Зөвхөн клубууд",
    regionalAssociations: "Бүсийн холбоод",
    title: "Гарчиг",
    message: "Мессеж",
    messageTitlePlaceholder: "Мэдэгдлийн гарчиг",
    messagePlaceholder: "Богино үйл ажиллагааны мэдээ бичнэ үү",
    sendNotification: "Мэдэгдэл илгээх",
    userAdministration: "Хэрэглэгчийн удирдлага",
    clubsRegionalAccounts: "Клуб ба бүсийн хаягууд",
    resetPassword: "Нууц үг сэргээх",
    signOut: "Гарах",
    lastName: "Овог",
    firstName: "Нэр",
    gender: "Хүйс",
    dateOfBirth: "Төрсөн огноо",
    email: "Имэйл",
    familyName: "Овог",
    givenName: "Нэр",
    submitRegistration: "Бүртгэл илгээх",
    cancel: "Цуцлах",
    registrationNote: "Бүртгэл илгээснээр МБХ-ны оффис баталгаажуулах хүлээгдэж буй профайл үүснэ.",
    rank: "Байр",
    move: "Өөрчлөлт",
    name: "Нэр",
    number: "№",
    roleClub: "Клуб",
    roleRegional: "Бүсийн холбоо",
    roleAdmin: "Админ",
    signedOut: "Системээс гарлаа.",
    invalidCredentials: "Нэвтрэх мэдээлэл буруу байна.",
    welcome: "Тавтай морил",
    athleteRegistrationSubmitted: "Тамирчны бүртгэл илгээгдлээ.",
    entryConfirmed: "Бүртгэл баталгаажлаа.",
    entryUpdated: "Бүртгэл шинэчлэгдлээ.",
    pairingAccepted: "Хосын хүсэлт зөвшөөрөгдлөө.",
    pairingUpdated: "Хосын хүсэлт шинэчлэгдлээ.",
    athleteActivated: "Тамирчин идэвхжлээ.",
    entryCrossClub: "Бүртгэл хадгалагдаж, хосын хүсэлт илгээгдлээ.",
    entrySubmitted: "Бүртгэл баталгаажуулах жагсаалт руу илгээгдлээ.",
    resultAdded: "Үр дүн нэмэгдэж, чансаа дахин тооцоологдлоо.",
    playersExportDownloaded: "Тамирчдын экспорт татагдлаа.",
    entriesExportDownloaded: "Бүртгэлийн экспорт татагдлаа.",
    notificationSent: "Мэдэгдэл илгээгдлээ.",
    passwordResetStaged: "Нууц үг сэргээх бэлтгэгдлээ:",
    registeredAthleteCount: "бүртгэлтэй тамирчин",
    regionSuffix: "бүс",
    activeAthletesMetric: "Идэвхтэй тамирчид",
    memberClubsMetric: "Гишүүн клуб",
    openEventsMetric: "Нээлттэй тэмцээн",
    confirmedEntriesMetric: "Баталгаажсан бүртгэл",
    eventsCount: "тэмцээн",
  },
};

type Copy = typeof copy.en;

function statusText(status: string, lang: Lang) {
  const labels = {
    en: { active: "Active", pending: "Pending", confirmed: "Confirmed", rejected: "Rejected", accepted: "Accepted", live: "Live", open: "Open", upcoming: "Upcoming", new: "New", sent: "Sent", urgent: "Urgent" },
    mn: { active: "Идэвхтэй", pending: "Хүлээгдэж буй", confirmed: "Баталгаажсан", rejected: "Татгалзсан", accepted: "Зөвшөөрсөн", live: "Шууд", open: "Нээлттэй", upcoming: "Удахгүй", new: "Шинэ", sent: "Илгээсэн", urgent: "Яаралтай" },
  };
  return labels[lang][status as keyof typeof labels.en] ?? status;
}

function roleText(role: Role, t: Copy) {
  return role === "admin" ? t.roleAdmin : role === "regional" ? t.roleRegional : t.roleClub;
}

function nextId(prefix: string) {
  return `${prefix}${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 90 + 10)}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function statusClass(status: string) {
  if (status === "confirmed" || status === "active" || status === "accepted" || status === "live") return "good";
  if (status === "pending" || status === "open") return "warn";
  if (status === "rejected") return "bad";
  return "neutral";
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/tab-separated-values;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function MainWebsite({
  lang,
  setLang,
  t,
  stats,
  rankings,
  rankTab,
  setRankTab,
  athletes,
  tournaments,
  login,
  openRegister,
}: {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Copy;
  stats: { label: string; value: number }[];
  rankings: Record<string, RankingRow[]>;
  rankTab: string;
  setRankTab: (tab: string) => void;
  athletes: Athlete[];
  tournaments: Tournament[];
  login: (id: string, password: string) => void;
  openRegister: () => void;
}) {
  const [loginId, setLoginId] = useState("CLUB-0042");
  const [password, setPassword] = useState("shuttle2026");
  const news = lang === "mn"
    ? [
        {
          tag: "Аварга",
          title: "Улсын аварга 2026 тэмцээн финалын шатандаа орлоо",
          body: "Улсын финал, нийтлэгдсэн оноолт, тамирчдын хөдөлгөөн, шинэчилсэн чансааг МБХ-ны албан тэмцээний хэсгээс дагана уу.",
          date: "2026.05.26",
        },
        {
          tag: "Хөгжил",
          title: "U13-U19 насны өсвөрийн хөгжлийн замнал нээгдлээ",
          body: "Бүсийн клубууд наймдугаар сарын хөгжлийн аварга шалгаруулах тэмцээн болон дагалдах сургалтад өсвөрийн тамирчдаа нэр дэвшүүлнэ.",
          date: "2026.08.09",
        },
        {
          tag: "Сургалт",
          title: "2-р түвшний дасгалжуулагчийн гэрчилгээний элсэлт зарлагдлаа",
          body: "Гишүүн клубын дасгалжуулагчид долдугаар сарын сургалтын блокт бүсийн холбоогоороо дамжуулан бүртгүүлнэ.",
          date: "2026 оны 7 сар",
        },
      ]
    : [
        {
          tag: "Championship",
          title: "National Championship 2026 reaches the final stages",
          body: "Follow national finals, published draws, athlete movement, and updated rankings from the official MBA competition desk.",
          date: "26 May 2026",
        },
        {
          tag: "Development",
          title: "Junior development pathway opens for U13-U19 players",
          body: "Regional clubs can nominate youth athletes for the August development championship and supporting coaching camp.",
          date: "9 Aug 2026",
        },
        {
          tag: "Education",
          title: "Level 2 coaching certification intake announced",
          body: "Affiliated coaches may apply for the July education block through their regional association.",
          date: "July 2026",
        },
      ];
  const programs = lang === "mn"
    ? [
        ["Тамирчны замнал", "Бүртгэлтэй тамирчдын улсын чансаа, насны ангилал, албан тэмцээний эрхийг нэгтгэнэ."],
        ["Клубын үйлчилгээ", "Тэмцээний бүртгэл, бүрэлдэхүүн, хосын баталгаажуулалт, экспортын дэмжлэгийг клубт үзүүлнэ."],
        ["Дасгалжуулагчийн сургалт", "Дасгалжуулагч, техникийн албаныханд зориулсан гэрчилгээ, дүрмийн шинэчлэл, практик нөөц."],
      ]
    : [
        ["Athlete pathway", "National ranking, age-group categories, and official competition eligibility for registered players."],
        ["Club services", "Tournament entry, roster maintenance, pairing approval, and export support for member clubs."],
        ["Coach education", "Certification, rule updates, and practical resources for coaches and technical officials."],
      ];
  const clubs = Array.from(new Map(athletes.map((athlete) => [athlete.clubId, athlete])).values());

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login(loginId, password);
  }

  return (
    <>
      <header className="topbar public-topbar">
        <div className="brand">
          <img src="/logo.png" alt="MBA Logo" className="w-20 h-20 object-contain bg-white rounded-md p-1" />
        </div>
        <nav className="top-links" aria-label="Main website navigation">
          <a href="#news">{t.news}</a>
          <a href="#about">{t.about}</a>
          <a href="#rankings">{t.rankings}</a>
          <a href="#calendar">{t.tournaments}</a>
          <a href="#clubs">{t.clubs}</a>
          <a href="#portal">{t.portal}</a>
          <button className="icon-btn" type="button" onClick={() => setLang(lang === "en" ? "mn" : "en")}>
            {lang === "en" ? "MN" : "EN"}
          </button>
        </nav>
      </header>

      <section className="main-hero">
        <div className="venue-panel public-hero">
          <Image
            src="/badminton-court.png"
            alt="Indoor badminton court prepared for tournament play"
            fill
            priority
            sizes="100vw"
          />
          <div className="venue-overlay">
            <p className="eyebrow">{t.officialAssociation}</p>
            <h1>{t.publicTitle}</h1>
            <p>{t.publicSubtitle}</p>
            <div className="hero-actions">
              <button className="primary-btn" type="button" onClick={openRegister}>
                {t.register}
              </button>
              <a className="secondary-btn" href="#calendar">
                {t.viewTournaments}
              </a>
              <a className="ghost-btn" href="#portal">
                {t.clubAdminPortal}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="metric-strip" aria-label="Association metrics">
        {stats.map((stat) => (
          <div key={stat.label} className="metric">
            <span>{stat.value}</span>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="content-band" id="news">
        <div className="section-head inline">
          <div>
            <p className="eyebrow">{t.latestUpdates}</p>
            <h2>{t.newsAnnouncements}</h2>
          </div>
          <a className="secondary-btn" href="#portal">{t.submitClubUpdate}</a>
        </div>
        <div className="news-grid">
          {news.map((item) => (
            <article className="news-card" key={item.title}>
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <time>{item.date}</time>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band about-band" id="about">
        <div className="about-copy">
          <p className="eyebrow">{t.aboutMba}</p>
          <h2>{t.aboutHeadline}</h2>
          <p>{t.aboutBody}</p>
        </div>
        <div className="program-grid">
          {programs.map(([title, body]) => (
            <article className="program-card" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band split" id="rankings">
        <div>
          <div className="section-head">
            <p className="eyebrow">{t.nationalStandings}</p>
            <h2>{t.currentRankings}</h2>
          </div>
          <RankingsTable rankings={rankings} rankTab={rankTab} setRankTab={setRankTab} compact lang={lang} />
        </div>
        <div>
          <div className="section-head">
            <p className="eyebrow">{t.registeredAthletes}</p>
            <h2>{t.playerSpotlight}</h2>
          </div>
          <div className="athlete-list">
            {athletes.slice(0, 6).map((athlete) => (
              <div className="athlete-row" key={athlete.id}>
                <span className="number">#{athlete.no}</span>
                <strong>{athlete.lastName} {athlete.firstName}</strong>
                <span>{athlete.club}</span>
                <Badge label={statusText(athlete.status, lang)} tone={statusClass(athlete.status)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-band" id="calendar">
        <div className="section-head inline">
          <div>
            <p className="eyebrow">{t.competitionCalendar}</p>
            <h2>{t.upcomingTournaments}</h2>
          </div>
          <button className="secondary-btn" type="button" onClick={openRegister}>
            {t.register}
          </button>
        </div>
        <TournamentList tournaments={tournaments} lang={lang} />
      </section>

      <section className="content-band split" id="clubs">
        <div>
          <div className="section-head">
            <p className="eyebrow">{t.memberNetwork}</p>
            <h2>{t.clubsRegions}</h2>
          </div>
          <div className="club-grid">
            {clubs.map((club) => (
              <article className="club-card" key={club.clubId}>
                <strong>{club.club}</strong>
                <p>{club.region} {t.regionSuffix}</p>
                <span>{athletes.filter((athlete) => athlete.clubId === club.clubId).length} {t.registeredAthleteCount}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="contact-panel">
          <p className="eyebrow">{t.contact}</p>
          <h2>{t.contactHeadline}</h2>
          <p>{t.contactBody}</p>
          <div className="contact-list">
            <span>extranet@badminton.mn</span>
            <span>+976 9167-1137</span>
            <span>Ulaanbaatar, Mongolia</span>
          </div>
        </div>
      </section>

      <section className="content-band portal-band" id="portal">
        <div>
          <p className="eyebrow">{t.clubAdminPortal}</p>
          <h2>{t.portalHeadline}</h2>
          <p>{t.portalBody}</p>
        </div>
        <aside className="login-panel compact-login">
          <form onSubmit={submit} className="stack-form">
            <label>
              {t.account}
              <select
                value={loginId}
                onChange={(event) => {
                  const next = event.target.value;
                  setLoginId(next);
                  setPassword(users[next].password);
                }}
              >
                {Object.values(users).map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.id} - {user.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t.password}
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
            </label>
            <button className="primary-btn full" type="submit">
              {t.signInPortal}
            </button>
          </form>
          <div className="demo-note">{t.demoCredentials}</div>
        </aside>
      </section>

      <footer className="site-footer">
        <span>{t.publicTitle}</span>
        <span>{t.footerLinks}</span>
      </footer>
    </>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("mn");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [page, setPage] = useState<PageKey>("dashboard");
  const [athletes, setAthletes] = useState<Athlete[]>(seedAthletes);
  const [entries, setEntries] = useState<Entry[]>(seedEntries);
  const [pairings, setPairings] = useState<Pairing[]>(seedPairings);
  const [rankings, setRankings] = useState<Record<string, RankingRow[]>>(seedRankings);
  const [rankTab, setRankTab] = useState("ms");
  const [toast, setToast] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const t = copy[lang];

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function login(id: string, password: string) {
    const user = users[id.toUpperCase()];
    if (!user || user.password !== password) {
      notify(t.invalidCredentials);
      return;
    }
    setCurrentUser(user);
    setPage("dashboard");
    notify(`${t.welcome}, ${lang === "mn" ? user.nameMn : user.name}`);
  }

  function addAthlete(payload: Omit<Athlete, "id" | "no" | "status">) {
    const athlete: Athlete = {
      ...payload,
      id: nextId("A"),
      no: String(120 + athletes.length),
      status: "pending",
    };
    setAthletes((items) => [athlete, ...items]);
    setRegisterOpen(false);
    notify(t.athleteRegistrationSubmitted);
  }

  function updateEntryStatus(id: string, status: Entry["status"]) {
    setEntries((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
    notify(status === "confirmed" ? t.entryConfirmed : t.entryUpdated);
  }

  function updatePairing(id: string, status: Pairing["status"]) {
    setPairings((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
    notify(status === "accepted" ? t.pairingAccepted : t.pairingUpdated);
  }

  function activateAthlete(id: string) {
    setAthletes((items) => items.map((item) => (item.id === id ? { ...item, status: "active" } : item)));
    notify(t.athleteActivated);
  }

  function submitEntry(athleteId: string, tournamentId: string, category: string) {
    if (!currentUser) return;
    const athlete = athletes.find((item) => item.id === athleteId);
    const tournament = tournaments.find((item) => item.id === tournamentId);
    if (!athlete || !tournament) return;
    const isCrossClub = currentUser.role === "club" && athlete.clubId !== currentUser.id;
    const entry: Entry = {
      id: nextId("E"),
      clubId: currentUser.id,
      clubName: currentUser.name,
      athleteId: athlete.id,
      athleteName: `${athlete.lastName} ${athlete.firstName}`,
      no: athlete.no,
      tournamentId: tournament.id,
      tournament: tournament.name,
      category,
      date: todayIso(),
      status: "pending",
    };
    setEntries((items) => [entry, ...items]);
    if (isCrossClub) {
      setPairings((items) => [
        {
          id: nextId("P"),
          fromClubId: currentUser.id,
          fromClub: currentUser.name,
          toClubId: athlete.clubId,
          toClub: athlete.club,
          athleteName: `${athlete.lastName} ${athlete.firstName}`,
          category,
          tournament: tournament.name,
          status: "pending",
        },
        ...items,
      ]);
    }
    notify(isCrossClub ? t.entryCrossClub : t.entrySubmitted);
  }

  function addResult(athleteId: string, category: string, points: number) {
    const athlete = athletes.find((item) => item.id === athleteId);
    if (!athlete) return;
    const tab = category.startsWith("WS") ? "ws" : category.startsWith("MD") ? "md" : category.startsWith("XD") ? "xd" : "ms";
    setRankings((current) => {
      const next = { ...current };
      const existing = [...(next[tab] ?? [])];
      const found = existing.find((item) => item.no === athlete.no);
      if (found) {
        found.previous = found.rank;
        found.points += points;
        found.events += 1;
      } else {
        existing.push({
          rank: existing.length + 1,
          previous: existing.length + 1,
          no: athlete.no,
          name: `${athlete.lastName} ${athlete.firstName}`,
          club: athlete.club,
          events: 1,
          points,
        });
      }
      next[tab] = existing
        .sort((a, b) => b.points - a.points)
        .map((row, index) => ({ ...row, rank: index + 1 }));
      return next;
    });
    notify(t.resultAdded);
  }

  const publicStats = useMemo(
    () => [
      { label: t.activeAthletesMetric, value: athletes.filter((item) => item.status === "active").length },
      { label: t.memberClubsMetric, value: new Set(athletes.map((item) => item.clubId)).size },
      { label: t.openEventsMetric, value: tournaments.filter((item) => item.status === "open" || item.status === "live").length },
      { label: t.confirmedEntriesMetric, value: entries.filter((item) => item.status === "confirmed").length },
    ],
    [athletes, entries, t],
  );

  return (
    <main className="site-shell" lang={lang === "mn" ? "mn" : "en"}>
      {!currentUser ? (
        <MainWebsite
          lang={lang}
          setLang={setLang}
          t={t}
          stats={publicStats}
          rankings={rankings}
          rankTab={rankTab}
          setRankTab={setRankTab}
          athletes={athletes}
          tournaments={tournaments}
          login={login}
          openRegister={() => setRegisterOpen(true)}
        />
      ) : (
        <Portal
          lang={lang}
          setLang={setLang}
          t={t}
          user={currentUser}
          page={page}
          setPage={setPage}
          athletes={athletes}
          entries={entries}
          pairings={pairings}
          rankings={rankings}
          rankTab={rankTab}
          setRankTab={setRankTab}
          tournaments={tournaments}
          submitEntry={submitEntry}
          addResult={addResult}
          activateAthlete={activateAthlete}
          updateEntryStatus={updateEntryStatus}
          updatePairing={updatePairing}
          logout={() => {
            setCurrentUser(null);
            notify(t.signedOut);
          }}
          notify={notify}
        />
      )}

      {registerOpen ? (
        <RegisterDialog
          t={t}
          athletes={athletes}
          close={() => setRegisterOpen(false)}
          addAthlete={addAthlete}
        />
      ) : null}

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </main>
  );
}

function Portal(props: {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Copy;
  user: User;
  page: PageKey;
  setPage: (page: PageKey) => void;
  athletes: Athlete[];
  entries: Entry[];
  pairings: Pairing[];
  rankings: Record<string, RankingRow[]>;
  rankTab: string;
  setRankTab: (tab: string) => void;
  tournaments: Tournament[];
  submitEntry: (athleteId: string, tournamentId: string, category: string) => void;
  addResult: (athleteId: string, category: string, points: number) => void;
  activateAthlete: (id: string) => void;
  updateEntryStatus: (id: string, status: Entry["status"]) => void;
  updatePairing: (id: string, status: Pairing["status"]) => void;
  logout: () => void;
  notify: (message: string) => void;
}) {
  const nav = props.user.role === "admin"
    ? ["dashboard", "athletes", "entries", "results", "export", "notifications", "users"]
    : props.user.role === "regional"
      ? ["dashboard", "athletes", "entries", "pairings", "tournaments", "rankings", "notifications"]
      : ["dashboard", "athletes", "compose", "entries", "pairings", "tournaments", "rankings", "notifications"];

  return (
    <div className="portal-shell">
    <aside className="sidebar">
        <div className="portal-brand flex items-center gap-3">
          <img src="/logo.png" alt="MBA Logo" className="w-20 h-20 object-contain bg-navyblue rounded-md p-1" />
          <div>
            <strong>{props.lang === "mn" ? props.user.nameMn : props.user.name}</strong>
            <p>{props.user.region} {props.t.portal}</p>
          </div>
        </div>
        <nav className="side-nav" aria-label="Portal navigation">
          {nav.map((key) => (
            <button
              key={key}
              className={props.page === key ? "active" : ""}
              type="button"
              onClick={() => props.setPage(key as PageKey)}
            >
              {props.t[key as keyof typeof props.t] ?? key}
            </button>
          ))}
        </nav>
        <button className="secondary-btn full" type="button" onClick={props.logout}>
          {props.t.signOut}
        </button>
      </aside>

     <section className="portal-main">
        <header className="portal-header sticky top-0 z-50 bg-white shadow-md border-b border-slate-200">
          <div className="user-chip" style={{ borderColor: props.user.color }}>
            <span style={{ background: props.user.color }}>{props.user.short}</span>
            <div>
              <strong>{props.lang === "mn" ? props.user.nameMn : props.user.name}</strong>
              <p>{roleText(props.user.role, props.t)}</p>
            </div>
          </div>
          <button className="icon-btn" type="button" onClick={() => props.setLang(props.lang === "en" ? "mn" : "en")}>
            {props.lang === "en" ? "MN" : "EN"}
        </button>

        </header>
        {props.page === "dashboard" ? <Dashboard {...props} /> : null}
        {props.page === "athletes" ? <AthletesPage {...props} /> : null}
        {props.page === "compose" ? <ComposePage {...props} /> : null}
        {props.page === "entries" ? <EntriesPage {...props} /> : null}
        {props.page === "pairings" ? <PairingsPage {...props} /> : null}
        {props.page === "tournaments" ? <TournamentPage {...props} /> : null}
        {props.page === "rankings" ? (
          <Panel title={props.t.rankings} eyebrow={props.t.nationalStandings}>
            <RankingsTable rankings={props.rankings} rankTab={props.rankTab} setRankTab={props.setRankTab} lang={props.lang} />
          </Panel>
        ) : null}
        {props.page === "results" ? <ResultsPage {...props} /> : null}
        {props.page === "export" ? <ExportPage {...props} /> : null}
        {props.page === "notifications" ? <NotificationsPage {...props} /> : null}
        {props.page === "users" ? <UsersPage {...props} /> : null}
      </section>
    </div>
  );
}

function Dashboard({
  lang,
  t,
  user,
  athletes,
  entries,
  pairings,
  rankings,
  setPage,
  updateEntryStatus,
  activateAthlete,
}: Parameters<typeof Portal>[0]) {
  const scopedAthletes = user.role === "admin"
    ? athletes
    : user.role === "regional"
      ? athletes.filter((athlete) => athlete.region === user.region)
      : athletes.filter((athlete) => athlete.clubId === user.id);
  const scopedEntries = user.role === "admin" ? entries : entries.filter((entry) => entry.clubId === user.id);
  const incomingPairings = pairings.filter((item) => item.toClubId === user.id && item.status === "pending");
  const pendingEntries = entries.filter((entry) => entry.status === "pending");
  const topRank = rankings.ms[0];

  return (
    <>
      <div className="page-title">
        <div>
          <p className="eyebrow">{t.operationsOverview}</p>
          <h1>{t.dashboard}</h1>
        </div>
        <div className="page-actions">
          {user.role !== "admin" ? (
            <button className="primary-btn" type="button" onClick={() => setPage("compose")}>
              {t.newEntry}
            </button>
          ) : (
            <button className="primary-btn" type="button" onClick={() => setPage("results")}>
              {t.uploadResult}
            </button>
          )}
        </div>
      </div>

      <div className="stat-grid">
        <Stat label={t.athletesLabel} value={scopedAthletes.length} detail={`${scopedAthletes.filter((item) => item.status === "active").length} ${t.activeDetail}`} />
        <Stat label={t.entries} value={scopedEntries.length} detail={`${scopedEntries.filter((item) => item.status === "confirmed").length} ${t.confirmedDetail}`} />
        <Stat label={t.pendingReview} value={user.role === "admin" ? pendingEntries.length : scopedEntries.filter((item) => item.status === "pending").length} detail={t.awaitingAction} />
        <Stat label={t.msLeader} value={`#${topRank.rank}`} detail={topRank.name} />
      </div>

      {incomingPairings.length ? (
        <div className="alert-line">
          <strong>{incomingPairings.length} {t.pairings}</strong>
          <button className="secondary-btn" type="button" onClick={() => setPage("pairings")}>
            {t.review}
          </button>
        </div>
      ) : null}

      <div className="two-column">
        <Panel title={user.role === "admin" ? t.pendingEntries : t.recentEntries} eyebrow={t.tournamentWorkflow}>
          <div className="compact-list">
            {(user.role === "admin" ? pendingEntries : scopedEntries).slice(0, 5).map((entry) => (
              <div className="compact-row" key={entry.id}>
                <div>
                  <strong>{entry.athleteName}</strong>
                  <span>{entry.clubName} / {entry.category} / {entry.tournament.replace(" 2026", "")}</span>
                </div>
                {user.role === "admin" && entry.status === "pending" ? (
                  <div className="row-actions">
                    <button className="mini good" type="button" onClick={() => updateEntryStatus(entry.id, "confirmed")}>{t.approve}</button>
                    <button className="mini bad" type="button" onClick={() => updateEntryStatus(entry.id, "rejected")}>{t.reject}</button>
                  </div>
                ) : (
                  <Badge label={statusText(entry.status, lang)} tone={statusClass(entry.status)} />
                )}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title={t.athleteApprovals} eyebrow={t.registry}>
          <div className="compact-list">
            {athletes.filter((athlete) => athlete.status === "pending").slice(0, 5).map((athlete) => (
              <div className="compact-row" key={athlete.id}>
                <div>
                  <strong>{athlete.lastName} {athlete.firstName}</strong>
                  <span>{athlete.club} / {athlete.events}</span>
                </div>
                {user.role === "admin" ? (
                  <button className="mini good" type="button" onClick={() => activateAthlete(athlete.id)}>{t.activate}</button>
                ) : (
                  <Badge label={statusText("pending", lang)} tone="warn" />
                )}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function AthletesPage({ lang, t, user, athletes, activateAthlete }: Parameters<typeof Portal>[0]) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const visible = athletes.filter((athlete) => {
    const allowed = user.role === "admin" || (user.role === "regional" ? athlete.region === user.region : athlete.clubId === user.id);
    const matchesQuery = `${athlete.no} ${athlete.lastName} ${athlete.firstName} ${athlete.club}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || athlete.status === status;
    return allowed && matchesQuery && matchesStatus;
  });

  return (
    <Panel title={t.athleteRegistry} eyebrow={t.searchApproval}>
      <div className="toolbar">
        <input placeholder={t.searchAthlete} value={query} onChange={(event) => setQuery(event.target.value)} />
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">{t.allStatus}</option>
          <option value="active">{statusText("active", lang)}</option>
          <option value="pending">{statusText("pending", lang)}</option>
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.number}</th>
              <th>{t.athlete}</th>
              <th>{t.club}</th>
              <th>{t.region}</th>
              <th>{t.events}</th>
              <th>{t.status}</th>
              <th>{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((athlete) => (
              <tr key={athlete.id}>
                <td className="number">#{athlete.no}</td>
                <td><strong>{athlete.lastName} {athlete.firstName}</strong><small>{athlete.email}</small></td>
                <td>{athlete.club}</td>
                <td>{athlete.region}</td>
                <td>{athlete.events}</td>
                <td><Badge label={statusText(athlete.status, lang)} tone={statusClass(athlete.status)} /></td>
                <td>
                  {user.role === "admin" && athlete.status === "pending" ? (
                    <button className="mini good" type="button" onClick={() => activateAthlete(athlete.id)}>{t.activate}</button>
                  ) : (
                    <span className="muted">{t.ready}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function ComposePage({ t, user, athletes, tournaments, submitEntry }: Parameters<typeof Portal>[0]) {
  const [athleteId, setAthleteId] = useState("");
  const [tournamentId, setTournamentId] = useState(tournaments.find((item) => item.status !== "upcoming")?.id ?? tournaments[0].id);
  const selectedTournament = tournaments.find((item) => item.id === tournamentId) ?? tournaments[0];
  const [category, setCategory] = useState(selectedTournament.categories[0]);
  const visibleAthletes = athletes.filter((athlete) => athlete.status === "active" && (user.role !== "club" || athlete.clubId === user.id || category.includes("D")));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!athleteId || !category) return;
    submitEntry(athleteId, tournamentId, category);
  }

  return (
    <Panel title={t.entryComposeTitle} eyebrow={t.tournamentEntry}>
      <form className="entry-form" onSubmit={submit}>
        <label>
          {t.tournament}
          <select
            value={tournamentId}
            onChange={(event) => {
              const next = event.target.value;
              setTournamentId(next);
              setCategory(tournaments.find((item) => item.id === next)?.categories[0] ?? "MS");
            }}
          >
            {tournaments.filter((item) => item.status !== "upcoming").map((tournament) => (
              <option key={tournament.id} value={tournament.id}>{tournament.name} - {tournament.date}</option>
            ))}
          </select>
        </label>
        <label>
          {t.category}
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {selectedTournament.categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          {t.athlete}
          <select value={athleteId} onChange={(event) => setAthleteId(event.target.value)}>
            <option value="">{t.selectAthlete}</option>
            {visibleAthletes.map((athlete) => (
              <option key={athlete.id} value={athlete.id}>
                #{athlete.no} - {athlete.lastName} {athlete.firstName} / {athlete.club}
              </option>
            ))}
          </select>
        </label>
        <div className="form-note">{t.doublesNote}</div>
        <button className="primary-btn fit" type="submit">{t.submitEntry}</button>
      </form>
    </Panel>
  );
}

function EntriesPage({ lang, t, user, entries, updateEntryStatus }: Parameters<typeof Portal>[0]) {
  const visible = user.role === "admin" ? entries : entries.filter((entry) => entry.clubId === user.id);
  return (
    <Panel title={t.entries} eyebrow={t.approvalQueue}>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.number}</th>
              <th>{t.athlete}</th>
              <th>{t.club}</th>
              <th>{t.tournament}</th>
              <th>{t.category}</th>
              <th>{t.status}</th>
              {user.role === "admin" ? <th>{t.review}</th> : null}
            </tr>
          </thead>
          <tbody>
            {visible.map((entry) => (
              <tr key={entry.id}>
                <td className="number">#{entry.no}</td>
                <td><strong>{entry.athleteName}</strong><small>{entry.date}</small></td>
                <td>{entry.clubName}</td>
                <td>{entry.tournament}</td>
                <td><Badge label={entry.category} tone="neutral" /></td>
                <td><Badge label={statusText(entry.status, lang)} tone={statusClass(entry.status)} /></td>
                {user.role === "admin" ? (
                  <td>
                    {entry.status === "pending" ? (
                      <div className="row-actions">
                        <button className="mini good" type="button" onClick={() => updateEntryStatus(entry.id, "confirmed")}>{t.approve}</button>
                        <button className="mini bad" type="button" onClick={() => updateEntryStatus(entry.id, "rejected")}>{t.reject}</button>
                      </div>
                    ) : <span className="muted">{t.reviewed}</span>}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function PairingsPage({ lang, t, user, pairings, updatePairing }: Parameters<typeof Portal>[0]) {
  const incoming = pairings.filter((item) => item.toClubId === user.id);
  const outgoing = pairings.filter((item) => item.fromClubId === user.id);
  return (
    <div className="two-column">
      <Panel title={t.incomingRequests} eyebrow={t.partnerApproval}>
        <PairingList pairings={incoming} incoming updatePairing={updatePairing} lang={lang} t={t} />
      </Panel>
      <Panel title={t.sentRequests} eyebrow={t.crossClubDoubles}>
        <PairingList pairings={outgoing} updatePairing={updatePairing} lang={lang} t={t} />
      </Panel>
    </div>
  );
}

function PairingList({
  pairings,
  incoming,
  updatePairing,
  lang,
  t,
}: {
  pairings: Pairing[];
  incoming?: boolean;
  updatePairing: (id: string, status: Pairing["status"]) => void;
  lang: Lang;
  t: Copy;
}) {
  if (!pairings.length) return <p className="empty-state">{t.noPairingRequests}</p>;
  return (
    <div className="compact-list">
      {pairings.map((pairing) => (
        <div className="compact-row" key={pairing.id}>
          <div>
            <strong>{pairing.athleteName}</strong>
            <span>{pairing.tournament} / {pairing.category} / {incoming ? pairing.fromClub : pairing.toClub}</span>
          </div>
          {incoming && pairing.status === "pending" ? (
            <div className="row-actions">
              <button className="mini good" type="button" onClick={() => updatePairing(pairing.id, "accepted")}>{t.accept}</button>
              <button className="mini bad" type="button" onClick={() => updatePairing(pairing.id, "rejected")}>{t.reject}</button>
            </div>
          ) : (
            <Badge label={statusText(pairing.status, lang)} tone={statusClass(pairing.status)} />
          )}
        </div>
      ))}
    </div>
  );
}

function TournamentPage({ t, tournaments, lang }: Parameters<typeof Portal>[0]) {
  return (
    <Panel title={t.competitionCalendar} eyebrow={t.competitionEntriesVenues}>
      <TournamentList tournaments={tournaments} lang={lang} />
    </Panel>
  );
}

function ResultsPage({ t, athletes, tournaments, addResult }: Parameters<typeof Portal>[0]) {
  const [athleteId, setAthleteId] = useState(athletes.find((item) => item.status === "active")?.id ?? "");
  const [category, setCategory] = useState("MS A");
  const [points, setPoints] = useState(100);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addResult(athleteId, category, points);
  }

  return (
    <div className="two-column">
      <Panel title={t.uploadResult} eyebrow={t.rankingEngine}>
        <form className="entry-form" onSubmit={submit}>
          <label>
            {t.tournament}
            <select>
              {tournaments.map((item) => <option key={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label>
            {t.category}
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {["MS A", "WS A", "MD A", "WD A", "XD A", "MS", "WS", "U15", "U17"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            {t.athlete}
            <select value={athleteId} onChange={(event) => setAthleteId(event.target.value)}>
              {athletes.filter((item) => item.status === "active").map((item) => (
                <option key={item.id} value={item.id}>#{item.no} - {item.lastName} {item.firstName}</option>
              ))}
            </select>
          </label>
          <label>
            {t.points}
            <input type="number" min="1" value={points} onChange={(event) => setPoints(Number(event.target.value))} />
          </label>
          <button className="primary-btn fit" type="submit">{t.updateRankings}</button>
        </form>
      </Panel>
      <Panel title={t.rankingRules} eyebrow="BWF">
        <div className="rules-list">
          <p>{t.resultRule1}</p>
          <p>{t.resultRule2}</p>
          <p>{t.resultRule3}</p>
        </div>
      </Panel>
    </div>
  );
}

function ExportPage({ t, athletes, entries, notify }: Parameters<typeof Portal>[0]) {
  function exportPlayers() {
    const rows = ["No.\tName\tFirstname\tCountry\tDOB\tGender\tEvents"];
    athletes.filter((item) => item.status === "active").forEach((item) => {
      rows.push(`${item.no}\t${item.lastName}\t${item.firstName}\tMNG\t${item.dob}\t${item.gender}\t${item.events}`);
    });
    downloadText(`Players_MBA_${todayIso()}.txt`, rows.join("\n"));
    notify(t.playersExportDownloaded);
  }

  function exportEntries() {
    const rows = ["Entry ID\tNo.\tAthlete\tClub\tTournament\tCategory\tDate\tStatus"];
    entries.filter((item) => item.status === "confirmed").forEach((item) => {
      rows.push(`${item.id}\t${item.no}\t${item.athleteName}\t${item.clubName}\t${item.tournament}\t${item.category}\t${item.date}\t${item.status}`);
    });
    downloadText(`Entries_MBA_${todayIso()}.txt`, rows.join("\n"));
    notify(t.entriesExportDownloaded);
  }

  return (
    <Panel title={t.tsExportTitle} eyebrow={t.tsCompatible}>
      <div className="export-grid">
        <div className="export-box">
          <h3>{t.playerList}</h3>
          <p>{athletes.filter((item) => item.status === "active").length} {t.activeAthletesExport}</p>
          <button className="primary-btn fit" type="button" onClick={exportPlayers}>{t.downloadPlayers}</button>
        </div>
        <div className="export-box">
          <h3>{t.confirmedEntries}</h3>
          <p>{entries.filter((item) => item.status === "confirmed").length} {t.confirmedEntriesExport}</p>
          <button className="secondary-btn fit" type="button" onClick={exportEntries}>{t.downloadEntries}</button>
        </div>
      </div>
    </Panel>
  );
}

function NotificationsPage({ lang, t, user, notify }: Parameters<typeof Portal>[0]) {
  const notices = lang === "mn"
    ? [
        ["Бүртгэлийн хугацааны сануулга", "Хойд бүсийн нээлттэй тэмцээний бүртгэл долоо хоногийн дараа хаагдана.", "new"],
        ["Оноолт нийтлэгдлээ", "Улсын аварга тэмцээний оноолтыг клубууд хянах боломжтой.", "sent"],
        ["Гишүүнчлэл сунгах", "Хэд хэдэн тамирчны гишүүнчлэл энэ сард дуусна.", "urgent"],
      ]
    : [
        ["Entry deadline reminder", "Northern Regional Open entries close in seven days.", "new"],
        ["Draw published", "National Championship draws are available for club review.", "sent"],
        ["Membership renewal", "Several athletes have membership expiry this month.", "urgent"],
      ];
  return (
    <Panel title={t.notifications} eyebrow={t.associationMessaging}>
      {user.role === "admin" ? (
        <form className="entry-form notification-form" onSubmit={(event) => { event.preventDefault(); notify(t.notificationSent); }}>
          <label>{t.recipients}<select><option>{t.allClubsAssociations}</option><option>{t.clubsOnly}</option><option>{t.regionalAssociations}</option></select></label>
          <label>{t.title}<input placeholder={t.messageTitlePlaceholder} /></label>
          <label>{t.message}<textarea placeholder={t.messagePlaceholder} /></label>
          <button className="primary-btn fit" type="submit">{t.sendNotification}</button>
        </form>
      ) : null}
      <div className="compact-list">
        {notices.map(([title, body, status]) => (
          <div className="compact-row" key={title}>
            <div>
              <strong>{title}</strong>
              <span>{body}</span>
            </div>
            <Badge label={statusText(status, lang)} tone={status === "urgent" ? "bad" : status === "new" ? "warn" : "neutral"} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function UsersPage({ lang, t, notify }: Parameters<typeof Portal>[0]) {
  return (
    <Panel title={t.userAdministration} eyebrow={t.clubsRegionalAccounts}>
      <div className="user-grid">
        {Object.values(users).filter((user) => user.role !== "admin").map((user) => (
          <div className="user-card" key={user.id}>
            <span style={{ background: user.color }}>{user.short}</span>
            <div>
              <strong>{lang === "mn" ? user.nameMn : user.name}</strong>
              <p>{user.id} / {roleText(user.role, t)} / {user.region}</p>
            </div>
            <button className="mini" type="button" onClick={() => notify(`${t.passwordResetStaged} ${user.id}.`)}>{t.resetPassword}</button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function RegisterDialog({
  t,
  athletes,
  close,
  addAthlete,
}: {
  t: Copy;
  athletes: Athlete[];
  close: () => void;
  addAthlete: (payload: Omit<Athlete, "id" | "no" | "status">) => void;
}) {
  const clubs = Array.from(new Map(athletes.map((athlete) => [athlete.clubId, athlete])).values());
  const [clubId, setClubId] = useState(clubs[0]?.clubId ?? "CLUB-0042");
  const club = clubs.find((item) => item.clubId === clubId) ?? clubs[0];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addAthlete({
      lastName: String(form.get("lastName") ?? ""),
      firstName: String(form.get("firstName") ?? ""),
      gender: String(form.get("gender") ?? "M") as "M" | "F",
      club: club.club,
      clubId: club.clubId,
      region: club.region,
      events: String(form.get("events") ?? "MS"),
      dob: String(form.get("dob") ?? ""),
      email: String(form.get("email") ?? ""),
    });
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-head">
          <div>
            <p className="eyebrow">{t.athleteRegistry}</p>
            <h2>{t.register}</h2>
          </div>
          <button className="icon-btn" type="button" onClick={close}>X</button>
        </div>
        <form className="entry-form" onSubmit={submit}>
          <div className="form-grid">
            <label>{t.lastName}<input required name="lastName" placeholder={t.familyName} /></label>
            <label>{t.firstName}<input required name="firstName" placeholder={t.givenName} /></label>
          </div>
          <div className="form-grid">
            <label>{t.gender}<select name="gender"><option value="M">M</option><option value="F">F</option></select></label>
            <label>{t.dateOfBirth}<input required name="dob" type="date" /></label>
          </div>
          <label>{t.email}<input required name="email" type="email" placeholder="name@example.mn" /></label>
          <div className="form-grid">
            <label>{t.club}<select value={clubId} onChange={(event) => setClubId(event.target.value)}>{clubs.map((item) => <option key={item.clubId} value={item.clubId}>{item.club}</option>)}</select></label>
            <label>{t.events}<input required name="events" placeholder="MS, MD, XD" /></label>
          </div>
          <div className="form-note">{t.registrationNote}</div>
          <div className="modal-actions">
            <button className="primary-btn fit" type="submit">{t.submitRegistration}</button>
            <button className="secondary-btn fit" type="button" onClick={close}>{t.cancel}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RankingsTable({
  rankings,
  rankTab,
  setRankTab,
  compact,
  lang = "en",
}: {
  rankings: Record<string, RankingRow[]>;
  rankTab: string;
  setRankTab: (tab: string) => void;
  compact?: boolean;
  lang?: Lang;
}) {
  const rows = rankings[rankTab] ?? [];
  const max = rows[0]?.points ?? 1;
  const t = copy[lang];
  return (
    <div>
      <div className="segmented">
        {["ms", "ws", "md", "xd"].map((tab) => (
          <button key={tab} type="button" className={rankTab === tab ? "active" : ""} onClick={() => setRankTab(tab)}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="table-wrap">
        <table className={compact ? "compact-table" : ""}>
          <thead>
            <tr>
              <th>{t.rank}</th>
              <th>{t.move}</th>
              <th>{t.name}</th>
              <th>{t.number}</th>
              <th>{t.club}</th>
              <th>{t.points}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const move = row.previous - row.rank;
              return (
                <tr key={`${rankTab}-${row.no}`}>
                  <td><span className="rank-badge">{row.rank}</span></td>
                  <td className={move > 0 ? "move-up" : move < 0 ? "move-down" : "muted"}>{move > 0 ? `+${move}` : move < 0 ? move : "0"}</td>
                  <td><strong>{row.name}</strong><small>{row.events} {t.eventsCount}</small></td>
                  <td className="number">{row.no}</td>
                  <td>{row.club}</td>
                  <td>
                    <div className="point-cell">
                      <span style={{ width: `${Math.round((row.points / max) * 100)}%` }} />
                      <strong>{row.points.toLocaleString()}</strong>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TournamentList({ tournaments, lang }: { tournaments: Tournament[]; lang: Lang }) {
  return (
    <div className="tournament-grid">
      {tournaments.map((tournament) => (
        <article className="tournament-row" key={tournament.id}>
          <div>
            <div className="row-title">
              <h3>{lang === "mn" ? tournament.nameMn : tournament.name}</h3>
              <Badge label={statusText(tournament.status, lang)} tone={statusClass(tournament.status)} />
            </div>
            <p>{tournament.date} / {tournament.venue}</p>
            <div className="category-row">
              {tournament.categories.map((item) => <Badge key={item} label={item} tone="neutral" />)}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Panel({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <div className="section-head">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value, detail }: { label: string; value: number | string; detail: string }) {
  return (
    <div className="stat">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: string }) {
  return <span className={`badge ${tone}`}>{label}</span>;
}







