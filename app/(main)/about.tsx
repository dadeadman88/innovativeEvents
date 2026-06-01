import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Text, View } from "react-native-ui-lib";

/**
 * Single block in a static legal/info document. Discriminated union so
 * the renderer below can render each block with consistent typography
 * without each call site having to pick styles.
 */
type Block =
    | { type: "h2"; text: string }
    | { type: "h3"; text: string }
    | { type: "p"; text: string }
    | { type: "bullets"; items: string[] };

type DocContent = {
    /** Optional one-liner directly under the screen title (smaller, white). */
    subheading?: string;
    /** Optional "Effective Date: …" caption shown under the subheading. */
    effectiveDate?: string;
    /**
     * Paragraphs that appear before any section heading. Use for the
     * lead-in copy that introduces the document.
     */
    intro?: string[];
    /** Ordered list of headings, paragraphs and bullet groups. */
    blocks: Block[];
};

/**
 * Privacy Policy content provided by the client. Lives inline (rather
 * than in a separate JSON file) so the document, the screen, and the
 * routing key (`title === "Privacy Policy"`) stay together.
 *
 * The screen header already renders the document title, so we don't
 * repeat it inside `subheading` / `intro`.
 */
const PRIVACY_POLICY: DocContent = {
    subheading: "Innovative Event Co Mobile Application",
    effectiveDate: "Effective Date: June 1, 2026",
    intro: [
        `Innovative Event Co ("Innovative Event Co," "we," "our," or "us") values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our mobile application, website, and related services.`,
        `By accessing or using our application, you agree to the practices described in this Privacy Policy.`,
    ],
    blocks: [
        { type: "h2", text: "Information We Collect" },
        { type: "h3", text: "Personal Information" },
        { type: "p", text: "We may collect information that identifies you, including:" },
        {
            type: "bullets",
            items: [
                "Full name",
                "Email address",
                "Phone number",
                "Mailing address",
                "Profile information",
                "Employment or contractor information",
                "Emergency contact information (if provided)",
            ],
        },

        { type: "h3", text: "Location Information" },
        { type: "p", text: "With your permission, we may collect precise or approximate location data to:" },
        {
            type: "bullets",
            items: [
                "Verify event attendance",
                "Confirm event check-in and check-out",
                "Support scheduling and staffing operations",
            ],
        },

        { type: "h3", text: "Device Information" },
        { type: "p", text: "We may automatically collect:" },
        {
            type: "bullets",
            items: [
                "Device type",
                "Operating system",
                "Mobile device identifiers",
                "IP address",
                "Browser and application usage information",
            ],
        },

        { type: "h3", text: "Event and Activity Information" },
        { type: "p", text: "We collect information related to your participation in company events, including:" },
        {
            type: "bullets",
            items: [
                "Event assignments",
                "Shift schedules",
                "Event reports",
                "Photos submitted through the app",
                "Communications with management",
            ],
        },

        { type: "h2", text: "How We Use Your Information" },
        { type: "p", text: "We use collected information to:" },
        {
            type: "bullets",
            items: [
                "Manage staffing and scheduling",
                "Verify attendance and event completion",
                "Communicate event opportunities and updates",
                "Process reports and event documentation",
                "Improve our services and application functionality",
                "Provide support and respond to inquiries",
                "Comply with legal obligations",
                "Protect the security and integrity of our platform",
            ],
        },

        { type: "h2", text: "How We Share Information" },
        { type: "p", text: "We do not sell your personal information." },
        { type: "p", text: "We may share information with:" },

        { type: "h3", text: "Business Clients" },
        { type: "p", text: "Information may be shared with clients when necessary to verify staffing, event completion, and program performance." },

        { type: "h3", text: "Service Providers" },
        { type: "p", text: "We may share information with trusted third-party providers who assist with:" },
        {
            type: "bullets",
            items: [
                "Application hosting",
                "Data storage",
                "Communication services",
                "Analytics and performance monitoring",
            ],
        },

        { type: "h3", text: "Legal Requirements" },
        { type: "p", text: "We may disclose information when required by law or when necessary to:" },
        {
            type: "bullets",
            items: [
                "Protect legal rights",
                "Comply with legal processes",
                "Respond to government requests",
                "Prevent fraud or security threats",
            ],
        },

        { type: "h2", text: "Data Security" },
        { type: "p", text: "We implement reasonable administrative, technical, and physical safeguards designed to protect personal information from unauthorized access, disclosure, alteration, or destruction." },
        { type: "p", text: "While we strive to protect your information, no system can guarantee absolute security." },

        { type: "h2", text: "Data Retention" },
        { type: "p", text: "We retain personal information only for as long as necessary to:" },
        {
            type: "bullets",
            items: [
                "Provide our services",
                "Meet contractual obligations",
                "Comply with legal requirements",
                "Resolve disputes",
                "Enforce company policies",
            ],
        },

        { type: "h2", text: "Your Rights" },
        { type: "p", text: "Depending on your location, you may have the right to:" },
        {
            type: "bullets",
            items: [
                "Access your personal information",
                "Request corrections to inaccurate information",
                "Request deletion of personal information",
                "Withdraw consent where applicable",
                "Request a copy of information we maintain about you",
            ],
        },
        { type: "p", text: "To exercise these rights, contact us using the information below." },

        { type: "h2", text: "Children\u2019s Privacy" },
        { type: "p", text: "Our services are intended for individuals who are at least 18 years old. We do not knowingly collect personal information from children under 18." },

        { type: "h2", text: "Third-Party Services" },
        { type: "p", text: "Our application may contain links to third-party services or websites. We are not responsible for the privacy practices of those third parties." },

        { type: "h2", text: "Changes to This Privacy Policy" },
        { type: "p", text: "We may update this Privacy Policy from time to time. Any changes will be posted within the application and will become effective upon posting." },
        { type: "p", text: "Continued use of the application after updates constitutes acceptance of the revised policy." },

        { type: "h2", text: "Contact Us" },
        { type: "p", text: "If you have questions regarding this Privacy Policy, please contact:" },
        { type: "p", text: "Innovative Event Co" },
        { type: "p", text: "Email: events@innovativeevent.co" },
    ],
};

/**
 * Terms & Conditions content provided by the client. Mirrors the same
 * `DocContent` shape as `PRIVACY_POLICY` so the existing renderer
 * handles it without any special casing.
 */
const TERMS_AND_CONDITIONS: DocContent = {
    subheading: "Innovative Event Co Terms and Conditions",
    effectiveDate: "Effective Date: June 2026",
    intro: [
        "By accessing or using the Innovative Event Co application, you agree to these Terms and Conditions.",
    ],
    blocks: [
        { type: "h2", text: "Acceptance of Terms" },
        { type: "p", text: "Your use of the application constitutes acceptance of these Terms. If you do not agree, please discontinue use of the application." },

        { type: "h2", text: "Eligibility" },
        { type: "p", text: "Users must:" },
        {
            type: "bullets",
            items: [
                "Be at least 18 years of age",
                "Provide accurate registration information",
                "Maintain the confidentiality of their account credentials",
            ],
        },

        { type: "h2", text: "Account Responsibilities" },
        { type: "p", text: "Users are responsible for:" },
        {
            type: "bullets",
            items: [
                "Maintaining account security",
                "Keeping information current and accurate",
                "All activities conducted through their account",
            ],
        },

        { type: "h2", text: "Use of the Application" },
        { type: "p", text: "Users agree to:" },
        {
            type: "bullets",
            items: [
                "Follow event instructions and company policies",
                "Submit accurate event reports",
                "Use the application only for authorized business purposes",
                "Comply with all applicable laws and regulations",
            ],
        },
        { type: "p", text: "Users may not:" },
        {
            type: "bullets",
            items: [
                "Share login credentials",
                "Attempt unauthorized access to systems",
                "Upload harmful software or malicious content",
                "Misrepresent event completion or reporting",
            ],
        },

        { type: "h2", text: "Scheduling and Event Participation" },
        { type: "p", text: "Innovative Event Co reserves the right to:" },
        {
            type: "bullets",
            items: [
                "Assign, modify, or cancel event opportunities",
                "Suspend access for policy violations",
                "Update event requirements as necessary",
            ],
        },
        { type: "p", text: "Submission of availability does not guarantee event assignments." },

        { type: "h2", text: "Intellectual Property" },
        { type: "p", text: "All content, branding, logos, software, and materials within the application remain the property of Innovative Event Co and may not be reproduced without written permission." },

        { type: "h2", text: "Limitation of Liability" },
        { type: "p", text: "Innovative Event Co shall not be liable for indirect, incidental, consequential, or special damages arising from the use of the application." },

        { type: "h2", text: "Termination" },
        { type: "p", text: "We reserve the right to suspend or terminate user access at any time for violations of these Terms or other legitimate business reasons." },

        { type: "h2", text: "Modifications" },
        { type: "p", text: "Innovative Event Co may update these Terms periodically. Continued use of the application after updates constitutes acceptance of revised Terms." },

        { type: "h2", text: "Governing Law" },
        { type: "p", text: "These Terms shall be governed by and construed in accordance with the laws of the State of Missouri, United States." },

        { type: "h2", text: "Contact" },
        { type: "p", text: "Innovative Event Co" },
        { type: "p", text: "Email: events@innovativeevent.co" },

        { type: "h2", text: "Data Collection Summary for App Store Review" },
        { type: "p", text: "The Innovative Event Co app collects user information including name, email address, phone number, location data (for event verification), scheduling information, event reporting data, and device information. Data is securely stored and used solely for event staffing, scheduling, communication, reporting, compliance verification, and operational purposes. User information is not sold to third parties. Access to collected data is restricted to authorized personnel and service providers necessary to operate the platform." },
    ],
};

/**
 * Title → document registry. Add new entries here when client provides
 * About App copy — the screen will pick them up automatically. Anything
 * not in this map falls through to the legacy Lorem ipsum placeholder
 * so unrouted titles still render *something*.
 *
 * Keys must match the `title` param sent from the calling screen
 * exactly (case + ampersand sensitive).
 */
const DOCS: Record<string, DocContent> = {
    "Privacy Policy": PRIVACY_POLICY,
    "Terms & Conditions": TERMS_AND_CONDITIONS,
};

const COLOR_TEXT = "#fff";
const COLOR_MUTED = "#818898";

/** Single bullet row: dot + flexible-width body. */
const BulletRow = ({ text }: { text: string }) => (
    <View row marginT-6 style={{ alignItems: "flex-start" }}>
        <Text regular small style={{ color: COLOR_MUTED, marginRight: 8, lineHeight: 22 }}>
            •
        </Text>
        <Text regular small style={{ color: COLOR_MUTED, flex: 1, lineHeight: 22 }}>
            {text}
        </Text>
    </View>
);

/** Render a single content block using consistent typography. */
const renderBlock = (block: Block, idx: number) => {
    switch (block.type) {
        case "h2":
            return (
                <Text
                    key={`b-${idx}`}
                    semibold
                    regularSize
                    marginT-24
                    style={{ color: COLOR_TEXT }}
                >
                    {block.text}
                </Text>
            );
        case "h3":
            return (
                <Text
                    key={`b-${idx}`}
                    semibold
                    small
                    marginT-16
                    style={{ color: COLOR_TEXT }}
                >
                    {block.text}
                </Text>
            );
        case "p":
            return (
                <Text
                    key={`b-${idx}`}
                    regular
                    small
                    marginT-8
                    style={{ color: COLOR_MUTED, lineHeight: 22 }}
                >
                    {block.text}
                </Text>
            );
        case "bullets":
            return (
                <View key={`b-${idx}`} marginT-2>
                    {block.items.map((item, i) => (
                        <BulletRow key={`bi-${idx}-${i}`} text={item} />
                    ))}
                </View>
            );
    }
};

/**
 * Generic info screen for legal/about pages. Receives a `title` param
 * from the previous screen and renders matching copy from `DOCS` if
 * present; otherwise falls back to the original Lorem ipsum so untyped
 * titles still display something instead of a blank screen.
 */
const AboutApp = () => {
    const { title } = useLocalSearchParams<{ title?: string }>();
    const resolvedTitle =
        typeof title === "string" && title.length > 0 ? title : "About App";

    const doc = DOCS[resolvedTitle];

    return (
        <Container
            appBar={false}
            contentBackgroundColor="#000"
            containerProps={{ style: { paddingHorizontal: "6%", paddingBottom: "8%" } }}
        >
            <View
                row
                centerV
                style={{
                    paddingTop: 8,
                    paddingBottom: 8,
                    alignItems: "center",
                }}
            >
                <BackButton style={{ marginBottom: 0 }} />
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text semibold regularSize style={{ color: "#fff" }}>
                        {resolvedTitle}
                    </Text>
                </View>
                <View style={{ width: moderateScale(50) }} />
            </View>

            {doc ? (
                <View marginT-20>
                    {doc.subheading ? (
                        <Text regular small style={{ color: COLOR_TEXT }}>
                            {doc.subheading}
                        </Text>
                    ) : null}
                    {doc.effectiveDate ? (
                        <Text
                            regular
                            small
                            marginT-6
                            style={{ color: COLOR_MUTED }}
                        >
                            {doc.effectiveDate}
                        </Text>
                    ) : null}

                    {doc.intro?.map((p, i) => (
                        <Text
                            key={`intro-${i}`}
                            regular
                            small
                            marginT-12
                            style={{ color: COLOR_MUTED, lineHeight: 22 }}
                        >
                            {p}
                        </Text>
                    ))}

                    {doc.blocks.map((b, i) => renderBlock(b, i))}

                    <View marginB-40 />
                </View>
            ) : (
                // Fallback for titles that don't have structured copy yet
                // (currently "About App" and "Terms & Conditions"). Keeps
                // the original placeholder UX so navigation never lands on
                // a blank screen while we wait for client-provided text.
                <View marginT-20>
                    <Text regular small style={{ color: COLOR_MUTED }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>

                    <Text regular small marginT-20 style={{ color: COLOR_MUTED }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>

                    <Text regular small marginT-20 style={{ color: COLOR_MUTED }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>

                    <Text regular small marginT-20 style={{ color: COLOR_MUTED }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                    </Text>

                    <View marginB-40 />
                </View>
            )}
        </Container>
    );
};

export default AboutApp;
