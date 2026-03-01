import React from "react";

const TermsAndConditionsAgency = () => {
  return (
    <div className="px-6 bg-white text-gray-900 max-h-[60vh] overflow-y-auto rounded-lg">
      {/* Top intro preserved from your original component */}
      <div>
        <br />
        {/* <h1 className="text-center text-3xl">Terms and Conditions</h1> */}
        <p>Welcome to our agency portal. Please read these Terms and Conditions carefully before using our services.</p>
        <br />
        <h2 className="text-center text-red-600 text-sm font-semibold">WORKO AGENCY SAAS TERMS OF USE</h2>
        <br />
      </div>

      {/* Preformatted block to preserve PDF-like spacing and line breaks, but using Tailwind for font/spacing */}
      <div className="">
        <pre className="whitespace-pre-wrap font-sans leading-6 text-xs">
          {`
1. Nature of Service – SaaS Platform Only
          1.1 Worko provides Agencies with access to a cloud-based recruitment management platform that 
            enables:
              • uploading candidate profiles for assigned job roles,
              • viewing duplication status (whether candidate exists from other sources),
              • tracking real-time candidate status updated by Corporates,
              • managing submissions, communication logs, and workflow insights,
              • using CV matching tools and additional paid features.

          1.2 Worko is not a recruitment agency, employer, staffing mediator, or talent agent. Worko does not 
            influence, control, guarantee, or participate in:
              • hiring decisions,
              • screening,
              • shortlisting,
              • interview scheduling,
              • feedback from Corporates.

          1.3 Worko serves solely as a software provider, facilitating collaboration between the Corporate and the
            Agency.The Agency agrees that Worko’s role is limited to:
              • providing software,
              • maintaining the platform,
              • generating workflow insights,
              • enabling communication and visibility.

2. Platform Access & Use
          2.1 Corporates may invite Agencies to collaborate on specific job roles.

          2.2 Agencies may use the Platform only for lawful recruitment and submission of candidates aligned to 
          those roles.

          2.3 Agencies are responsible for ensuring all information submitted is accurate.

3. User Accounts & Login Restrictions
          3.1 Agencies may purchase additional logins (“seats”) for their team.

          3.2 Each login must be used by a single individual only. Sharing passwords is strictly prohibited.

          3.3 If Worko detects login sharing, unauthorized access, or misuse, Worko may:
              • suspend or terminate accounts,
              • revoke access without refund,
              • deny recovery of lost data.

          3.4 Worko is not liable for any breach, misuse, or data leak resulting from password sharing by the 
          Agency.

4. Candidate Upload, Ownership & Data Processing
          4.1 Agencies are solely responsible for obtaining candidate consent before uploading profiles.

          4.2 Once uploaded:
              • Corporates will access the candidate profile, review it, and update the status based on their internal 
                evaluation.
              • The Agency will see all status changes in real time (subject to Corporate updates).

          4.3 Worko receives candidate data from multiple sources (Agencies, candidates,
          Corporates, job boards).
            Therefore:
              • Worko has full rights to access, store, process, analyse, and use any candidate
              profile uploaded by the Agency,
              • Worko may use candidate data for internal system training, matching engine
              improvement, duplication checks, analytics, and product development,
              • Agency acknowledges that uploading a profile does not give exclusivity.

          4.4 Worko is not responsible if:
              • the same candidate exists on the Platform from multiple sources,
              • Corporates do not update the candidate status,
              • feedback is delayed, incomplete, or inaccurate.

5. Confidentiality & Data Protection
          5.1 All candidate information on the Platform is confidential.

          5.2 Agencies must NOT:
              • share, download, copy, or misuse candidate data from the Platform,
              • use candidate data for unrelated roles unless independently sourced,
              • disclose data to any unauthorized parties.

          5.3 Agencies are responsible for all data they upload.

          5.4 Worko may process candidate data internally as required for Platform
          functionality and improvement.

6. SaaS Features, Credits & Payments
          6.1 Agencies may purchase:
              • CV Matching Credits,
              • Additional logins,
              • Premium tools or features.

          6.2 Purchased credits are non-transferable and non-refundable except as required
          by law.

          6.3 Worko may update pricing or features with notice on the website.

7. Worko’s Role & Limitations
          7.1 Worko has no obligation to verify candidate information uploaded by the Agency.

          7.2 Worko does not guarantee:
              • job shortlisting,
              • interviews,
              • selections,
              • candidate outcomes.

          7.3 All final decisions are made solely by the Corporate.
            Worko is not responsible for:
              • hiring timelines,
              • delays,
              • candidate rejection,
              • lack of feedback from Corporates.

8. Prohibited Usage
          Agencies must not:
            • attempt to bypass Worko and approach the Corporate directly for the same job,
            • scrape, extract, or reverse-engineer Worko’s systems,
            • upload misleading, stolen, or fraudulent candidate profiles,
            • misuse the platform in any way that harms candidate or corporate interests.

9. Suspension & Termination
          Worko may suspend or terminate Agency access for:
            • login sharing,
            • data misuse,
            • fraudulent candidate submissions,
            • breach of Terms,
            • suspicious or harmful behavior.
          No refunds will be provided for terminated accounts due to violations.

10. Liability
          10.1 Worko provides the platform as-is and as-available.

          10.2 Worko is not responsible for:
            • errors in candidate profiles,
            • use or misuse of Agency accounts,
            • corporate feedback delays,
            • business losses or missed opportunities,
            • disputes between Corporate and Agency.

11. Governing Law
          These Terms are governed by the laws of India.
          Disputes will be resolved exclusively in the courts of Bangalore, Karnatka.
`}
        </pre>
      </div>
    </div>
  );
};

export default TermsAndConditionsAgency;
