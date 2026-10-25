// =============================================================================
// Data layer - imports the existing JSON files (untouched, same location) and
// exposes typed accessors. All display strings render verbatim; the only
// processing is normalizeRichHtml(), which adapts legacy markup classes from
// the old Angular site to this site's CSS (no data files are written).
// =============================================================================
import dataInfo from './assets/data/dataInfo.json';
import facts from './assets/data/facts.json';
import services from './assets/data/services.json';
import testimonials from './assets/data/testimonials.json';

export interface InfoItem {
    Icon: string;
    Text: string;
    TextHref: string;
    TextRaw: string;
    Type: string;
    Year?: string;
}

export interface SkillItem {
    Value: string;
    Text: string;
}

export interface TimelineEntry {
    Time: string;
    Location: string;
    Text: string;
    Icon?: string;
    Value: string[];
}

export interface ProjectEntry {
    Date: string;
    Text: string;
    Value: string[];
}

export interface CertificateEntry {
    Date: string;
    Text: string;
    Value: string[];
}

export interface EcosystemItem {
    Href: string;
    Label: string;
    Note: string;
}

export interface FactItem {
    Text: string;
    Icon: string;
    Value: number;
}

export interface ServiceItem {
    Name: string;
    Description: string;
    Link: string;
    Icon: string;
    IconBoxColor: string;
}

export interface TestimonialItem {
    Name: string;
    Category: string;
    Image: string;
    Quote: string;
}

export interface DataInfo {
    Information: {
        Title: string;
        FullName: string;
        ShortName?: string;
        FirstName?: string;
        LastName?: string;
        Initials?: string;
        Major?: string;
        Avatar?: string;
        AvatarCv?: string;
        QrCode?: string;
        Status?: string;
        Slogan: string;
        Degree: string;
        Icon: string;
        Data: InfoItem[];
    };
    PersonalSkills: { Text: string; Icon: string; Data: SkillItem[] };
    GoogleSkills: { Text: string; Icon: string; Data: SkillItem[] };
    ProgrommingSkills: {
        Text: string;
        Icon: string;
        HighlightSkills?: string[];
        Data: SkillItem[];
    };
    CareerObjective: {
        Text: string;
        Icon: string;
        Quote: string;
        About: string;
        Introduction: string;
    };
    Education: { Text: string; Icon: string; Data: TimelineEntry[] };
    WorkExperience: { Text: string; Icon: string; Data: TimelineEntry[] };
    IndividualProjects: { Text: string; Icon: string; Data: ProjectEntry[] };
    Certificate: { Text: string; Icon: string; Data: CertificateEntry[] };
    Ecosystem?: EcosystemItem[];
}

// Map-pin SVG injected where the legacy strings embed
// <i class='fa fa-map-marker'></i> (styled as .icon-inline in global.scss).
const MAP_PIN =
    '<svg class="icon-inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';

// Adapt legacy markup to the new design system:
//   - Font Awesome <i> pin     -> inline SVG
//   - w3-tag "Current" pill    -> .badge-current
//   - target='_blank' without rel -> add rel="noopener noreferrer"
export function normalizeRichHtml(html: string): string {
    return html
        .replace(/<i class='fa fa-map-marker'><\/i>/g, MAP_PIN)
        .replace(/class='w3-tag color-bkg w3-round'/g, "class='badge-current'")
        .replace(/target='_blank'/g, "target='_blank' rel='noopener noreferrer'");
}

export const info = dataInfo as unknown as DataInfo;
export const factsData = facts as unknown as { Title: string; Description: string; Data: FactItem[] };
export const servicesData = services as unknown as {
    Title: string;
    Description: string;
    Data: ServiceItem[];
};
export const testimonialsData = testimonials as unknown as {
    Title: string;
    Description: string;
    Data: TestimonialItem[];
};

const rawFullName = info.Information.FullName || '';
const nameParts = rawFullName.trim().split(/\s+/);
const defaultFirstName = nameParts[0] || '';
const defaultLastName = nameParts.slice(1).join(' ') || '';
const defaultInitials = nameParts.length > 1
    ? (nameParts[nameParts.length - 2][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : defaultFirstName.slice(0, 2).toUpperCase() || 'TT';

const techSkillYears = info.ProgrommingSkills.Data
    .map((s) => Number(s.Value))
    .filter((y) => !isNaN(y) && y > 1990 && y < 2100);
const startYear = techSkillYears.length > 0 ? Math.min(...techSkillYears) : 2017;
const yearsOfExperience = Math.max(1, new Date().getFullYear() - startYear);

const phoneItem = info.Information.Data.find((d) => d.Type === 'phone');
const phoneRaw = phoneItem?.TextRaw ?? '';
const phoneHref = 'tel:+' + phoneRaw.replace(/\D/g, '');

const githubItem = info.Information.Data.find((d) => d.Type === 'github');
const websiteItem = info.Information.Data.find((d) => d.Type === 'website');

export const profile = {
    name: rawFullName,
    firstName: info.Information.FirstName || defaultFirstName,
    lastName: info.Information.LastName || defaultLastName,
    shortName: info.Information.ShortName || `${defaultFirstName} ${defaultLastName}`.trim(),
    initials: info.Information.Initials || defaultInitials,
    slogan: info.Information.Slogan,
    degree: info.Information.Degree,
    major: info.Information.Major || 'IT',
    avatar: info.Information.Avatar || '/assets/images/avatar-profile.jpg',
    avatarCv: info.Information.AvatarCv || '/assets/images/avatar-profile.jpg',
    qrCode: info.Information.QrCode || '/assets/images/qr-code.svg',
    status: info.Information.Status || 'Open to opportunities',
    role: info.Information.Data.find((d) => d.Type === 'title')?.TextRaw ?? 'Developer',
    location: info.Information.Data.find((d) => d.Type === 'location')?.TextRaw ?? '',
    email: info.Information.Data.find((d) => d.Type === 'email')?.TextRaw ?? '',
    phone: phoneRaw,
    phoneHref: phoneHref,
    github: githubItem?.TextHref ?? '',
    website: websiteItem?.TextHref ?? '',
    websiteRaw: websiteItem?.TextRaw ?? '',
    startYear,
    yearsOfExperience,
    highlightSkills: info.ProgrommingSkills.HighlightSkills ?? [
        '.NET Core',
        'C#',
        'TypeScript',
        'Angular',
        'React',
        'Umbraco',
    ],
};

// Social media links for Hero / navigation
export const socials = [
    { icon: 'github', href: profile.github, label: 'GitHub' },
    {
        icon: 'skype',
        href: info.Information.Data.find((d) => d.Type === 'skype')?.TextHref ?? '',
        label: 'Skype',
    },
    { icon: 'mail', href: profile.email ? `mailto:${profile.email}` : '', label: 'Email' },
    { icon: 'globe', href: profile.website, label: 'Website' },
].filter((s) => Boolean(s.href));

// Ecosystem items for Footer
export const ecosystem: EcosystemItem[] = info.Ecosystem ?? [
    { Href: 'https://www.t4vn.com', Label: 't4vn.com', Note: 'T4VN - home base' },
    { Href: 'https://utpro.dev', Label: 'utpro.dev', Note: 'Umbraco Turbo Pro' },
    { Href: 'https://www.nuget.org/profiles/thientu', Label: 'NuGet', Note: 'Open-source packages' },
    { Href: profile.github, Label: 'GitHub', Note: 'Source & projects' },
];

// Terminal lines for Hero interactive visual
export const terminalLines = [
    { prompt: true, text: 'whoami' },
    {
        out: true,
        text: `${profile.github.split('/').filter(Boolean).pop() || 'thientu995'} — ${profile.role.toLowerCase()}`,
    },
    { prompt: true, text: 'cat stack.txt' },
    { out: true, text: profile.highlightSkills.join(' · ') },
    { prompt: true, text: 'uptime --career' },
    {
        out: true,
        text: `${profile.yearsOfExperience}+ years · ${factsData.Data.find((f) => f.Text.toLowerCase().includes('project'))?.Value ?? 500}+ projects shipped`,
    },
    { ok: true, text: profile.status.toLowerCase() },
];

// Contact channels rendered as cards in the Contact section. The tel: href
// is rebuilt from the digits of TextRaw - the data ships "tel:(+84)35 653
// 0909" with spaces/parens, which is not a valid tel: URI.
export const contactChannels = info.Information.Data.filter((d) =>
    ['email', 'phone', 'skype', 'github', 'website'].includes(d.Type),
).map((d) =>
    d.Type === 'phone'
        ? { ...d, TextHref: 'tel:+' + d.TextRaw.replace(/\D/g, '') }
        : d,
);

// Personal facts rendered in the About aside.
export const personalFacts = info.Information.Data.filter((d) =>
    ['title', 'birthday', 'location'].includes(d.Type),
);

// Technical skills grouped by the year the value carries ("2017", "2020"...),
// newest group first - the year is a "since" marker, not a score.
export const techSkillGroups = (() => {
    const groups = new Map<string, string[]>();
    for (const skill of info.ProgrommingSkills.Data) {
        const list = groups.get(skill.Value) ?? [];
        list.push(skill.Text);
        groups.set(skill.Value, list);
    }
    return [...groups.entries()]
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([year, items]) => ({ year, items }));
})();

// Percentage-based skill sets for the animated bars.
export const otherSkills = info.PersonalSkills.Data.map((s) => ({
    label: s.Text,
    value: Number(s.Value),
}));

export const googleSkills = info.GoogleSkills.Data.map((s) => ({
    label: s.Text,
    value: Number(s.Value),
}));

export const site = {
    url: profile.website || 'https://cv.t4vn.com',
    title: `${info.Information.FullName} — ${profile.role}`,
    description: info.CareerObjective.Quote,
};
