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
        Slogan: string;
        Degree: string;
        Icon: string;
        Data: InfoItem[];
    };
    PersonalSkills: { Text: string; Icon: string; Data: SkillItem[] };
    GoogleSkills: { Text: string; Icon: string; Data: SkillItem[] };
    ProgrommingSkills: { Text: string; Icon: string; Data: SkillItem[] };
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

export const profile = {
    name: info.Information.FullName,
    slogan: info.Information.Slogan,
    role: info.Information.Data.find((d) => d.Type === 'title')?.TextRaw ?? 'Developer',
    location: info.Information.Data.find((d) => d.Type === 'location')?.TextRaw ?? '',
    email: info.Information.Data.find((d) => d.Type === 'email')?.TextRaw ?? '',
    phone: info.Information.Data.find((d) => d.Type === 'phone')?.TextRaw ?? '',
    github: info.Information.Data.find((d) => d.Type === 'github')?.TextHref ?? '',
    website: info.Information.Data.find((d) => d.Type === 'website')?.TextHref ?? '',
};

// Contact channels rendered as cards in the Contact section.
export const contactChannels = info.Information.Data.filter((d) =>
    ['email', 'phone', 'skype', 'github', 'website'].includes(d.Type),
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
    url: 'https://cv.t4vn.com',
    title: `${info.Information.FullName} — ${profile.role}`,
    description: info.CareerObjective.About,
};
