import type { CaseData, PublicCaseData } from '../../shared/types';

export const CASE_LIBRARY: Record<string, CaseData> = {
  'case-001': {
    id: 'case-001',
    caseNumber: 'CASE #001',
    title: 'The Last Train',
    difficulty: 'Easy',
    location: 'Northbridge Station — Platform 3',
    incidentTime: '11:47 PM',
    incidentDate: 'November 17, 2026',
    introduction:
      'At 11:30 PM, railway attendant Daniel was scheduled to lock Platform 3 following the final passenger departure. When night supervisor Hayes arrived at 11:45 PM for the shift handover, Daniel was missing. The station security gates were locked from the inside, but Daniel’s personal mobile phone was buzzing on the bench and the final passenger express had departed at 11:38 PM without him.',
    objective:
      'Determine what happened to Daniel and explain how he departed the station using the discovered evidence.',
    maxInspections: 3,
    objects: [
      {
        id: 'station_clock',
        name: 'Station Wall Clock',
        description: 'An antique brass clock mounted high above the timetable board.',
        icon: 'clock',
        sceneX: 18,
        sceneY: 28,
        accessibilityLabel: 'Inspect the antique station wall clock',
      },
      {
        id: 'train_ticket',
        name: 'Crumpled Railway Ticket',
        description: 'A discarded yellow transit slip tucked beneath a platform bench.',
        icon: 'ticket',
        sceneX: 38,
        sceneY: 74,
        accessibilityLabel: 'Inspect the crumpled railway ticket',
      },
      {
        id: 'footprints',
        name: 'Muddy Bootprints',
        description: 'Faint tracks leading between the maintenance hatch and the supervisor booth.',
        icon: 'footprints',
        sceneX: 58,
        sceneY: 82,
        accessibilityLabel: 'Inspect the muddy bootprints on the platform floor',
      },
      {
        id: 'cctv_monitor',
        name: 'Security CCTV Console',
        description: 'A flickering CRT screen showing archived recordings of the platform.',
        icon: 'cctv',
        sceneX: 78,
        sceneY: 34,
        accessibilityLabel: 'Inspect the security CCTV monitor console',
      },
      {
        id: 'logbook',
        name: 'Supervisor Roster Logbook',
        description: 'A hardcover logbook resting on the station dispatch desk.',
        icon: 'logbook',
        sceneX: 32,
        sceneY: 48,
        accessibilityLabel: 'Inspect the supervisor roster logbook on the desk',
      },
      {
        id: 'abandoned_suitcase',
        name: 'Concealed Leather Bag',
        description: 'A worn leather duffel bag wedged behind the baggage scales.',
        icon: 'suitcase',
        sceneX: 62,
        sceneY: 52,
        accessibilityLabel: 'Inspect the concealed leather bag behind the luggage counter',
      },
    ],
    evidenceMap: {
      station_clock: {
        objectId: 'station_clock',
        title: 'Tampered Clock Mechanism',
        evidenceText:
          'The hands are frozen at 11:14 PM. Looking behind the casing reveals the battery backup lead was deliberately disconnected, and grease pencil marks indicate it was manually wound backward.',
        detailedObservation:
          'Whoever stopped the clock wanted anyone glancing at the wall or security cameras to believe an incident occurred before 11:15 PM.',
        visualType: 'clock',
      },
      train_ticket: {
        objectId: 'train_ticket',
        title: 'Unscheduled Freight Pass',
        evidenceText:
          'A company freight manifest ticket stamped "11:15 PM Southbound Cargo #402 — Crew Car Access Only". Daniel’s employee ID number is penciled in the authorization box.',
        detailedObservation:
          'A freight train departed 23 minutes before the passenger express. Daniel had an authorized boarding slip for that cargo train.',
        visualType: 'ticket',
      },
      footprints: {
        objectId: 'footprints',
        title: 'Dual Footwear Tracks',
        evidenceText:
          'Two distinct sets of boot prints. One set is size 10 with worn heels (matching Daniel’s work boots). The second set is a fresh size 8 steel-toe print arriving from the maintenance service tunnel.',
        detailedObservation:
          'A second person with size 8 boots entered through the service tunnel and met Daniel on the platform before the passenger train arrived.',
        visualType: 'footprints',
      },
      cctv_monitor: {
        objectId: 'cctv_monitor',
        title: 'Discrepant Video Footage',
        evidenceText:
          'Camera 4 recorded a figure wearing Daniel’s distinctive high-visibility station jacket locking the platform gate at 11:32 PM. However, the jacket hangs noticeably loose, and the figure stands roughly 5’8” tall—Daniel is documented as 6’1”.',
        detailedObservation:
          'The person on camera wearing Daniel’s uniform after 11:30 PM was an impersonator.',
        visualType: 'cctv',
      },
      logbook: {
        objectId: 'logbook',
        title: 'Rejected Shift Exchange',
        evidenceText:
          'An entry from yesterday: "Attendant Daniel requested shift handover to trainee Miller for tonight due to personal urgency. Request DENIED by Head Office—Daniel required to lock up." Attached is an inventory note: "Spare master key #14 unaccounted for."',
        detailedObservation:
          'Daniel desperately wanted someone else on duty tonight. Trainee Miller was his intended replacement, and a spare key was missing.',
        visualType: 'logbook',
      },
      abandoned_suitcase: {
        objectId: 'abandoned_suitcase',
        title: 'Packed Duffel & Secret Note',
        evidenceText:
          'Inside the bag: Daniel’s civilian passport, £2,000 in cash, an overdue debt notice threatening immediate seizure, and a handwritten note: "Miller, take my high-vis jacket at 11:10 PM. Lock Platform 3 at 11:30 so the cameras see you. I’ll be aboard Cargo #402. Key 14 is in the locker."',
        detailedObservation:
          'Daniel orchestrated his own escape to flee loan sharks, using trainee Miller as a costumed body double to fake his presence until he was safely gone.',
        visualType: 'suitcase',
      },
    },
    rubric: {
      correctConclusion:
        'Daniel was not kidnapped or missing; he intentionally staged his disappearance to flee personal debts by arranging for trainee Miller (or an impersonator) to wear his uniform and lock up Platform 3 as a decoy while Daniel secretly boarded the 11:15 PM freight train.',
      requiredFacts: [
        'Daniel left intentionally / was not a victim of foul play',
        'An accomplice or impersonator (Miller) wore Daniel’s jacket/uniform as a decoy',
        'Daniel boarded the 11:15 PM freight train to escape',
      ],
      supportingEvidence: [
        'The CCTV shows a shorter person wearing Daniel’s jacket',
        'The footprints show two people (Daniel size 10, Miller size 8) meeting from the tunnel',
        'The freight ticket confirms Daniel arranged travel on Cargo 402 at 11:15 PM',
        'The clock was tampered with to falsify the timeline',
        'The suitcase contained cash, debt notices, and instructions for the decoy',
      ],
      acceptableAlternatives: [
        'Daniel hired someone to cover his shift secretly and fled on the freight train',
        'Daniel had a stand-in wear his clothes while he escaped debt on the cargo train',
        'Daniel used an impersonator to fake being at the station while he caught an earlier train',
      ],
      commonMisconceptions: [
        'Daniel was murdered or abducted by an intruder',
        'Daniel missed his train and got lost in the tunnel',
        'The supervisor stole the money and framed Daniel',
      ],
      unsupportedAssumptions: [
        'Assuming a violent struggle occurred without physical evidence',
        'Assuming the train crashed',
      ],
    },
    officialSolution:
      'Daniel was not abducted. Facing mounting financial debt, he planned his escape from Northbridge. Knowing management rejected his shift transfer, he gave spare key #14 to trainee Miller. At 11:10 PM, Miller entered via the maintenance tunnel and took Daniel’s high-vis jacket. While Miller acted as a visual decoy for the CCTV cameras at 11:30 PM, Daniel had already boarded the 11:15 PM southbound freight train in the crew car.',
    officialExplanation:
      'The key to solving this mystery lies in the physical discrepancies: the CCTV showed a person much shorter than Daniel locking the gate, corroborated by the two distinct sets of footprints (size 10 and size 8). The crumpled freight ticket reveals Daniel’s true departure at 11:15 PM, explaining why the clock was stopped at 11:14 PM. The abandoned bag confirms Daniel’s motive (debt) and proves premeditation with Miller.',
    scheduledDate: '2026-11-17',
    revealDate: '2026-11-18T00:05:00.000Z',
    status: 'published',
  },

  'case-002': {
    id: 'case-002',
    caseNumber: 'CASE #002',
    title: 'The Midnight Gallery',
    difficulty: 'Medium',
    location: 'Blackwood Estate — High Security Vault',
    incidentTime: '02:15 AM',
    incidentDate: 'November 18, 2026',
    introduction:
      'At 02:15 AM, the security siren at the Blackwood Private Gallery shrieked. Guards arrived in less than 90 seconds to find the centerpiece display empty: Lord Blackwood’s "Eye of Verona" sapphire was gone. Yet the laser tripwires were unbroken, the glass vitrine was unscratched, and the biometric vault door remained locked from the outside.',
    objective:
      'Explain how the sapphire necklace was stolen without triggering the laser grid or shattering the glass case.',
    maxInspections: 3,
    objects: [
      {
        id: 'glass_case',
        name: 'Sapphire Display Vitrine',
        description: 'An airtight glass vitrine resting atop an ornamental mahogany pedestal.',
        icon: 'glass',
        sceneX: 50,
        sceneY: 55,
        accessibilityLabel: 'Inspect the sapphire display vitrine',
      },
      {
        id: 'thermostat',
        name: 'Digital Climate Controller',
        description: 'A wall-mounted HVAC panel monitoring ambient temperature and humidity.',
        icon: 'thermometer',
        sceneX: 82,
        sceneY: 30,
        accessibilityLabel: 'Inspect the digital climate controller panel',
      },
      {
        id: 'laser_grid_log',
        name: 'Laser Security Terminal',
        description: 'A diagnostic terminal tracking active infrared beam integrity.',
        icon: 'grid',
        sceneX: 20,
        sceneY: 42,
        accessibilityLabel: 'Inspect the laser security diagnostic terminal',
      },
      {
        id: 'curator_glove',
        name: 'Discarded Archive Glove',
        description: 'A white cotton handler’s glove dropped near the return air vent.',
        icon: 'feather',
        sceneX: 35,
        sceneY: 80,
        accessibilityLabel: 'Inspect the discarded archive glove near the vent',
      },
      {
        id: 'skylight_rope',
        name: 'Ventilation Shaft Access',
        description: 'An overhead ceiling duct directly vertical to the pedestal.',
        icon: 'briefcase',
        sceneX: 50,
        sceneY: 18,
        accessibilityLabel: 'Inspect the overhead ventilation shaft access',
      },
      {
        id: 'vault_manifest',
        name: 'Gallery Appraisal Register',
        description: 'A leather-bound registry listing gallery access and item values.',
        icon: 'logbook',
        sceneX: 72,
        sceneY: 70,
        accessibilityLabel: 'Inspect the gallery appraisal register',
      },
    ],
    evidenceMap: {
      glass_case: {
        objectId: 'glass_case',
        title: 'Unbolted Pedestal Base',
        evidenceText:
          'The glass vitrine is completely intact, but inspecting the underside of the mahogany pedestal reveals four countersunk brass bolts were unscrewed from below, allowing the central velvet riser to be drawn downward into the hollow pedestal.',
        detailedObservation:
          'The thief did not break into the glass from the top or sides; they extracted the jewel from beneath the pedestal.',
        visualType: 'safe',
      },
      thermostat: {
        objectId: 'thermostat',
        title: 'Remotely Triggered Deep Chill',
        evidenceText:
          'The vault temperature is set to 11°C (normal is 21°C). Logs show an override command was sent at 01:30 AM from IP address assigned to the Curator’s private home study.',
        detailedObservation:
          'The severe temperature drop was intended to contract metal fasteners and neutralize thermal infrared sensors.',
        visualType: 'painting',
      },
      laser_grid_log: {
        objectId: 'laser_grid_log',
        title: 'System Calibration Window',
        evidenceText:
          'The log shows zero beam breaches, but highlights an automatic 4-second internal calibration reboot at precisely 02:14:50 AM, during which laser beams are momentarily disarmed.',
        detailedObservation:
          'Whoever pulled off the heist knew the exact four-second window when the laser security system was blind.',
        visualType: 'cctv',
      },
      curator_glove: {
        objectId: 'curator_glove',
        title: 'Graphite Residue & Vent Hook',
        evidenceText:
          'The glove is dusted with fine graphite powder (used to lubricate mechanical linkages silently) and blue chalk used by maintenance contractors. Inside the wristband are the stitched initials "E.V."',
        detailedObservation:
          'Edward Vance, the assistant curator, recently handled mechanical tools around the air ducts.',
        visualType: 'feather',
      },
      skylight_rope: {
        objectId: 'skylight_rope',
        title: 'Magnetic Cable Line',
        evidenceText:
          'Inside the ceiling vent duct: a high-tensile braided wire with an electromagnetic retriever head and miniature optical camera, running through the ductwork toward the curator’s office.',
        detailedObservation:
          'The heist was conducted remotely through the ventilation shaft without anyone stepping into the vault.',
        visualType: 'briefcase',
      },
      vault_manifest: {
        objectId: 'vault_manifest',
        title: 'Scheduled Insurance Audit',
        evidenceText:
          'Notes indicate an international insurance audit was set for 9:00 AM this morning. In the margin, Assistant Curator Edward Vance wrote: "Authenticity certs missing for Verona stone. Re-inspection will fail."',
        detailedObservation:
          'Vance had an urgent motive: the morning audit would have exposed that the sapphire was already a replica or improperly certified.',
        visualType: 'logbook',
      },
    },
    rubric: {
      correctConclusion:
        'Assistant Curator Edward Vance stole the sapphire remotely from the ventilation system above by utilizing a magnetic cable during the 4-second laser calibration reboot, lowering the pedestal riser from below without triggering alarms or breaking the glass, motivated by avoiding the impending morning insurance audit.',
      requiredFacts: [
        'Assistant Curator Vance was the perpetrator / inside job',
        'The theft was committed through the ventilation shaft / remotely using magnetic gear',
        'Exploited the 4-second laser reboot / unbolted the pedestal from below without breaking glass',
      ],
      supportingEvidence: [
        'The glass was untouched because the pedestal was unbolted from underneath',
        'The laser log proves a 4-second calibration blind spot at 02:14 AM',
        'The ceiling vent contained a magnetic wire retrieval system',
        'Glove with initials E.V. and graphite residue connects Vance to the duct',
        'Vance had motive due to the pending insurance audit exposing fraud',
      ],
      acceptableAlternatives: [
        'Curator Vance used the air vents and a magnetic line during the laser reboot to steal the sapphire from underneath the case',
        'An inside job by Vance who fished the jewel out through the ceiling duct during the security reset to hide fake jewels from auditors',
      ],
      commonMisconceptions: [
        'A cat burglar entered through the main door',
        'The glass case was melted with a laser',
        'The security guard took it and framed Vance',
      ],
      unsupportedAssumptions: [
        'Assuming guards were bribed',
        'Assuming the laser was physically cut',
      ],
    },
    officialSolution:
      'The theft was an ingenious inside job by Assistant Curator Edward Vance. Facing an insurance audit at 9:00 AM that would uncover missing provenance papers, Vance rigged the vault. He set the thermostat to 11°C to dull thermal sensors, unbolted the pedestal base during evening maintenance, and dropped an electromagnetic retriever through the ceiling ventilation duct. At 02:14:50 AM, during the scheduled 4-second laser reboot, he triggered the magnetic cable, pulled the gem down through the unbolted pedestal, and reeled it up the shaft without setting foot in the room.',
    officialExplanation:
      'The puzzle hinges on the impossible physical state: unbroken glass and an intact laser grid. Discovering that the pedestal was unfastened from underneath and connecting the overhead vent cable with the 4-second reboot proves the jewel was taken vertically. Vance’s glove and insurance notes seal the motive and identity.',
    scheduledDate: '2026-11-18',
    revealDate: '2026-11-19T00:05:00.000Z',
    status: 'scheduled',
  },

  'case-003': {
    id: 'case-003',
    caseNumber: 'CASE #003',
    title: 'The Crimson Alibi',
    difficulty: 'Hard',
    location: 'Harriman Manor — The Study',
    incidentTime: '10:30 PM',
    incidentDate: 'November 19, 2026',
    introduction:
      'Industrialist Arthur Harriman was found dead in his locked second-floor study at 10:45 PM. The coroner estimated death by cyanide poisoning at 10:30 PM. All three guests had ironclad alibis for 10:30 PM: nephew Julian was playing the grand piano downstairs, partner Marcus was strolling in the rain garden with the butler, and niece Eleanor was on the telephone with the London Exchange until 10:35 PM.',
    objective:
      'Identify who murdered Arthur Harriman and explain how they orchestrated their false alibi.',
    maxInspections: 3,
    objects: [
      {
        id: 'teacup',
        name: 'Earl Grey Teacup',
        description: 'A fine porcelain cup beside Arthur’s ledger on the mahogany desk.',
        icon: 'cup',
        sceneX: 30,
        sceneY: 55,
        accessibilityLabel: 'Inspect the Earl Grey teacup on the desk',
      },
      {
        id: 'pocket_watch',
        name: 'Shattered Pocket Watch',
        description: 'Arthur’s gold pocket watch lying on the Persian rug.',
        icon: 'watch',
        sceneX: 52,
        sceneY: 78,
        accessibilityLabel: 'Inspect the shattered gold pocket watch',
      },
      {
        id: 'fireplace_ashes',
        name: 'Hearth Ash Fragments',
        description: 'Charred paper scraps smoldering in the marble fireplace.',
        icon: 'safe',
        sceneX: 75,
        sceneY: 45,
        accessibilityLabel: 'Inspect the charred paper scraps in the fireplace',
      },
      {
        id: 'medicine_bottle',
        name: 'Sideboard Inhaler',
        description: 'A medical asthma inhaler sitting beside Arthur’s reading glasses.',
        icon: 'poison',
        sceneX: 85,
        sceneY: 62,
        accessibilityLabel: 'Inspect the medical asthma inhaler on the sideboard',
      },
      {
        id: 'will_draft',
        name: 'Solicitor’s Testament',
        description: 'An open legal envelope delivered by courier earlier that evening.',
        icon: 'logbook',
        sceneX: 22,
        sceneY: 38,
        accessibilityLabel: 'Inspect the solicitor’s testament letter',
      },
      {
        id: 'telephone_switchboard',
        name: 'Manor Switchboard Junction',
        description: 'The internal telephone junction box in the hallway alcove.',
        icon: 'cctv',
        sceneX: 45,
        sceneY: 25,
        accessibilityLabel: 'Inspect the telephone switchboard junction box',
      },
    ],
    evidenceMap: {
      teacup: {
        objectId: 'teacup',
        title: 'Unpoisoned Tea Liquid',
        evidenceText:
          'Forensic test of the liquid inside the teacup shows pure Earl Grey with honey—zero poison detected. However, Arthur always took his asthma inhaler immediately after hot drinks to ease steam-induced coughing.',
        detailedObservation:
          'The poison was not ingested via the teacup, despite being the obvious suspect item.',
        visualType: 'poison',
      },
      pocket_watch: {
        objectId: 'pocket_watch',
        title: 'Artificially Stopped Watch',
        evidenceText:
          'The crystal glass is smashed and hands read 10:30 PM. Examining the internal gears reveals a drop of quick-drying cyanoacrylate resin placed on the escapement wheel at approximately 10:00 PM, stopping it prematurely.',
        detailedObservation:
          'The watch did not stop from a fall at 10:30 PM; it was pre-timed to halt at 10:30 PM to fabricate an alibi time window.',
        visualType: 'watch',
      },
      fireplace_ashes: {
        objectId: 'fireplace_ashes',
        title: 'Burnt Piano Sheet Music',
        evidenceText:
          'Fragments of burnt paper include musical notation for Chopin’s Nocturne with notes scribbled in nephew Julian’s hand: "Player-piano roll modified to 22 minutes duration. Sync with study clock."',
        detailedObservation:
          'Julian was not actually sitting at the piano playing live; a motorized mechanical player-piano roll was performing.',
        visualType: 'painting',
      },
      medicine_bottle: {
        objectId: 'medicine_bottle',
        title: 'Lethal Inhaler Nozzle',
        evidenceText:
          'Swab analysis of the inhaler mouthpiece reveals a thick coating of potassium cyanide dissolved in glycerine. One single inhalation delivered a fatal pulmonary dose in seconds.',
        detailedObservation:
          'The murder weapon was the inhaler, which Arthur reached for after his tea.',
        visualType: 'poison',
      },
      will_draft: {
        objectId: 'will_draft',
        title: 'Disinheritance Notice',
        evidenceText:
          'A codicil drafted at 8:00 PM: "Arthur Harriman revokes all trust disbursements to Julian Harriman immediately due to embezzlement. Sole estate passes to Eleanor."',
        detailedObservation:
          'Julian had an existential motive to kill his uncle before the codicil was signed and notarized tomorrow.',
        visualType: 'logbook',
      },
      telephone_switchboard: {
        objectId: 'telephone_switchboard',
        title: 'Clean Phone Records',
        evidenceText:
          'The switchboard shows Eleanor’s call to London was genuine, continuous, and verified by the city operator from 10:12 PM to 10:35 PM with no tampering.',
        detailedObservation:
          'Eleanor’s alibi is genuine. She could not have committed the murder.',
        visualType: 'cctv',
      },
    },
    rubric: {
      correctConclusion:
        'Nephew Julian Harriman murdered Arthur by poisoning his asthma inhaler nozzle with cyanide, then faked his alibi by sabotaging Arthur’s pocket watch to stop at 10:30 PM and using a modified player-piano roll to simulate playing music downstairs, motivated by imminent disinheritance.',
      requiredFacts: [
        'Nephew Julian was the killer',
        'The murder weapon was the poisoned inhaler mouthpiece (not the tea)',
        'Julian used an automated player-piano to fake his musical alibi while rigging the watch to 10:30 PM',
      ],
      supportingEvidence: [
        'The tea was clean, but the inhaler was coated in cyanide and glycerine',
        'The watch was artificially glued to stop at 10:30 PM',
        'Burnt sheet music proves Julian used a timed mechanical piano roll',
        'The will draft shows Julian was being disinherited for embezzlement',
        'Switchboard logs confirm Eleanor’s phone alibi was real',
      ],
      acceptableAlternatives: [
        'Julian killed Arthur with poison on the inhaler and used an automated piano to give himself an alibi at 10:30',
        'Julian poisoned his uncle’s inhaler to prevent being cut from the will and faked being at the piano with a self-playing roll',
      ],
      commonMisconceptions: [
        'Eleanor poisoned the tea over the telephone',
        'Marcus poisoned Arthur in the garden',
        'Arthur committed suicide over the embezzlement',
      ],
      unsupportedAssumptions: [
        'Assuming the tea was poisoned',
        'Assuming Eleanor collaborated with Julian',
      ],
    },
    officialSolution:
      'Nephew Julian Harriman is the killer. Facing ruin after Arthur discovered his embezzlement and drafted a revised will, Julian acted before morning. Knowing Arthur always used his inhaler after hot tea, Julian coated the inhaler nozzle with cyanide and glycerine at 9:30 PM. To construct an airtight alibi, he put slow glue on Arthur’s watch so it stopped at 10:30 PM, and activated a 22-minute mechanical player-piano roll in the parlor. While guests heard "Julian" playing downstairs, Arthur died upstairs in seconds when he inhaled.',
    officialExplanation:
      'The teacup was a red herring: tests showed the tea was unpoisoned, directing attention to the inhaler. The broken pocket watch was mechanically stopped with glue at 10:00 PM to fabricate the 10:30 PM timeline. The burnt sheet music exposed Julian’s player-piano deception, and the will confirmed his motive.',
    scheduledDate: '2026-11-19',
    revealDate: '2026-11-20T00:05:00.000Z',
    status: 'scheduled',
  },
};

export const getPublicCaseData = (caseData: CaseData, isRevealedOverride?: boolean): PublicCaseData => {
  const isRevealed =
    isRevealedOverride !== undefined
      ? isRevealedOverride
      : new Date().getTime() >= new Date(caseData.revealDate).getTime();

  return {
    id: caseData.id,
    caseNumber: caseData.caseNumber,
    title: caseData.title,
    difficulty: caseData.difficulty,
    location: caseData.location,
    incidentTime: caseData.incidentTime,
    incidentDate: caseData.incidentDate,
    introduction: caseData.introduction,
    objective: caseData.objective,
    maxInspections: caseData.maxInspections,
    objects: caseData.objects,
    isRevealed,
    revealDate: caseData.revealDate,
    ...(isRevealed
      ? {
          officialSolution: caseData.officialSolution,
          officialExplanation: caseData.officialExplanation,
        }
      : {}),
  };
};

export const getTodayPakistanDate = (): string => {
  // Pakistan Standard Time is UTC+5
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const pktDate = new Date(utc + 5 * 3600000);
  const year = pktDate.getFullYear();
  const month = String(pktDate.getMonth() + 1).padStart(2, '0');
  const day = String(pktDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_CASE: CaseData = CASE_LIBRARY['case-001']!;

export const getCaseForDate = (dateStr: string): CaseData => {
  // Check if any case is specifically scheduled for dateStr
  for (const caseId of Object.keys(CASE_LIBRARY)) {
    const c = CASE_LIBRARY[caseId];
    if (c && c.scheduledDate === dateStr && (c.status === 'published' || c.status === 'scheduled')) {
      return c;
    }
  }
  // Default to case-001 as primary mystery
  return DEFAULT_CASE;
};
