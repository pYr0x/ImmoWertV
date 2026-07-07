/**
 * Anlage 4 ImmoWertV, Abschnitt III: Beschreibung der Gebäudestandards
 * für die übrigen Gebäudearten (Standardstufen 3–5).
 * Quelle: https://www.gesetze-im-internet.de/immowertv_2022/anlage_4.html
 * (Fundstelle: BGBl. I 2021, 2824—2855) — Texte amtlich, automatisiert
 * aus der amtlichen HTML-Fassung extrahiert (Abruf: 07.07.2026).
 *
 * Für diese Gebäudearten weist die Anlage 4 KEINE Wägungsanteile aus;
 * die Tabellen dienen als amtliche Einstufungshilfe für den Gesamtstandard.
 * Wohnhäuser (Nr. 1) und Garagen (Nr. 8) sind mit ihren Kostengruppen in
 * nhk2010.ts abgebildet und hier bewusst nicht dupliziert.
 */

export interface StandardMerkmal {
  merkmal: string;
  /** Beschreibung je Standardstufe 3, 4, 5 */
  stufen: [string, string, string];
}

export interface StandardsGruppe {
  id: string;
  /** Amtliche Überschrift aus Anlage 4 Abschnitt III */
  titel: string;
  /** NHK-Typcodes, für die diese Beschreibungen gelten */
  codes: string[];
  merkmale: StandardMerkmal[];
}

export const STANDARD_BESCHREIBUNGEN: StandardsGruppe[] = [
  {
    id: "mfh",
    titel: "Mehrfamilienhäuser, Wohnhäuser mit Mischnutzung",
    codes: ["4.1","4.2","4.3","5.1"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "ein-/zweischaliges Mauerwerk, z. B. aus Leichtziegeln, Kalksandsteinen, Gasbetonsteinen; Edelputz; Wärmedämmverbundsystem oder Wärmedämmputz (nach ca. 1995)",
          "Verblendmauerwerk, zweischalig, hinterlüftet, Vorhangfassade (z. B. Naturschiefer); Wärmedämmung (nach ca. 2005)",
          "aufwendig gestaltete Fassaden mit konstruktiver Gliederung (Säulenstellungen, Erker etc.), Sichtbeton-Fertigteile, Natursteinfassade, Elemente aus Kupfer-/Eloxalblech, mehrgeschossige Glasfassaden; hochwertigste Dämmung",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Faserzement-Schindeln, beschichtete Betondachsteine und Tondachziegel, Folienabdichtung; Dachdämmung (nach ca. 1995)",
          "glasierte Tondachziegel; Flachdachausbildung tlw. als Dachterrasse; Konstruktion in Brettschichtholz, schweres Massivflachdach; besondere Dachform, z. B. Mansarden-, Walmdach; Aufsparrendämmung, überdurchschnittliche Dämmung (nach ca. 2005)",
          "hochwertige Eindeckung z. B. aus Schiefer oder Kupfer, Dachbegrünung, befahrbares Flachdach; stark überdurchschnittliche Dämmung",
        ],
      },
      {
        merkmal: "Fenster und Außentüren",
        stufen: [
          "Zweifachverglasung (nach ca. 1995), Rollläden (manuell); Haustür mit zeitgemäßem Wärmeschutz (nach ca. 1995)",
          "Dreifachverglasung, Sonnenschutzglas, aufwendigere Rahmen, Rollläden (elektr.); höherwertige Türanlagen z. B. mit Seitenteil, besonderer Einbruchschutz",
          "große, feststehende Fensterflächen, Spezialverglasung (Schall- und Sonnenschutz); Außentüren in hochwertigen Materialien",
        ],
      },
      {
        merkmal: "Innenwände und -türen",
        stufen: [
          "nicht tragende Innenwände in massiver Ausführung bzw. mit Dämmmaterial gefüllte Ständerkonstruktionen; schwere Türen",
          "Sichtmauerwerk; Massivholztüren, Schiebetürelemente, Glastüren, strukturierte Türblätter",
          "gestaltete Wandabläufe (z. B. Pfeilervorlagen, abgesetzte oder geschwungene Wandpartien); Brandschutzverkleidung; raumhohe aufwendige Türelemente",
        ],
      },
      {
        merkmal: "Deckenkonstruktion",
        stufen: [
          "Betondecken mit Tritt- und Luftschallschutz (z. B. schwimmender Estrich); einfacher Putz",
          "zusätzlich Deckenverkleidung",
          "Deckenvertäfelungen (Edelholz, Metall)",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "Linoleum-, Teppich-, Laminat- und PVC-Böden besserer Art und Ausführung, Fliesen, Kunststeinplatten",
          "Natursteinplatten, Fertigparkett, hochwertige Fliesen, Terrazzobelag, hochwertige Massivholzböden auf gedämmter Unterkonstruktion",
          "hochwertiges Parkett, hochwertige Natursteinplatten, hochwertige Edelholzböden auf gedämmter Unterkonstruktion",
        ],
      },
      {
        merkmal: "Sanitäreinrichtungen",
        stufen: [
          "1 Bad mit WC je Wohneinheit; Dusche und Badewanne; Wand- und Bodenfliesen, raumhoch gefliest",
          "1 bis 2 Bäder je Wohneinheit mit tlw. zwei Waschbecken, tlw. Bidet/Urinal, Gäste-WC, bodengleiche Dusche; Wand- und Bodenfliesen jeweils in gehobener Qualität",
          "2 und mehr Bäder je Wohneinheit; hochwertige Wand- und Bodenplatten (oberflächenstrukturiert, Einzel- und Flächendekors)",
        ],
      },
      {
        merkmal: "Heizung",
        stufen: [
          "elektronisch gesteuerte Fern- oder Zentralheizung, Niedertemperatur- oder Brennwertkessel",
          "Fußbodenheizung, Solarkollektoren für Warmwassererzeugung",
          "Solarkollektoren für Warmwassererzeugung und Heizung, Blockheizkraftwerk, Wärmepumpe, Hybrid-Systeme",
        ],
      },
      {
        merkmal: "Sonstige technische Ausstattung",
        stufen: [
          "zeitgemäße Anzahl an Steckdosen und Lichtauslässen; Zählerschrank (ab ca. 1985) mit Unterverteilung und Kippsicherungen",
          "zahlreiche Steckdosen und Lichtauslässe, hochwertige Abdeckungen, dezentrale Lüftung mit Wärmetauscher, mehrere LAN- und Fernsehanschlüsse, Personenaufzugsanlagen",
          "Video- und zentrale Alarmanlage, zentrale Lüftung mit Wärmetauscher, Klimaanlage; Bussystem; aufwendige Personenaufzugsanlagen",
        ],
      },
    ],
  },
  {
    id: "buero",
    titel: "Bürogebäude, Banken, Geschäftshäuser",
    codes: ["5.2","5.3","6.1","6.2"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "ein-/zweischalige Konstruktion; Wärmedämmverbundsystem oder Wärmedämmputz (nach ca. 1995)",
          "Verblendmauerwerk, zweischalig, hinterlüftet, Vorhangfassade (z. B. Naturschiefer); Wärmedämmung (nach ca. 2005)",
          "aufwendig gestaltete Fassaden mit konstruktiver Gliederung (Säulenstellungen, Erker etc.), Sichtbeton-Fertigteile, Natursteinfassade, Elemente aus Kupfer-/Eloxalblech, mehrgeschossige Glasfassaden; Vorhangfassade aus Glas; stark überdurchschnittliche Dämmung",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Faserzement-Schindeln, beschichtete Betondachsteine und Tondachziegel, Folienabdichtung; Dachdämmung (nach ca. 1995)",
          "glasierte Tondachziegel; schweres Massivflachdach; besondere Dachform; überdurchschnittliche Dämmung (nach ca. 2005)",
          "hochwertige Eindeckung z. B. aus Schiefer oder Kupfer; Dachbegrünung; befahrbares Flachdach; aufwendig gegliederte Dachlandschaft; stark überdurchschnittliche Dämmung",
        ],
      },
      {
        merkmal: "Fenster und Außentüren",
        stufen: [
          "Zweifachverglasung (nach ca. 1995)",
          "Dreifachverglasung, Sonnenschutzglas, aufwendigere Rahmen, höherwertige Türanlagen",
          "große, feststehende Fensterflächen, Spezialverglasung (Schall- und Sonnenschutz); Außentüren in hochwertigen Materialien; Automatiktüren",
        ],
      },
      {
        merkmal: "Innenwände und -türen",
        stufen: [
          "nicht tragende Innenwände in massiver Ausführung; schwere Türen",
          "Sichtmauerwerk, Massivholztüren, Schiebetürelemente, Glastüren, Innenwände für flexible Raumkonzepte (größere statische Spannweiten der Decken)",
          "gestaltete Wandabläufe (z. B. Pfeilervorlagen, abgesetzte oder geschwungene Wandpartien); Wände aus großformatigen Glaselementen, Akustikputz, tlw. Automatiktüren; rollstuhlgerechte Bedienung",
        ],
      },
      {
        merkmal: "Deckenkonstruktion",
        stufen: [
          "Betondecken mit Tritt- und Luftschallschutz; einfacher Putz; abgehängte Decken",
          "höherwertige abgehängte Decken",
          "Deckenvertäfelungen (Edelholz, Metall)",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "Linoleum- oder Teppich-Böden besserer Art und Ausführung; Fliesen, Kunststeinplatten",
          "Natursteinplatten, Fertigparkett, hochwertige Fliesen, Terrazzobelag, hochwertige Massivholzböden auf gedämmter Unterkonstruktion",
          "hochwertiges Parkett, hochwertige Natursteinplatten, hochwertige Edelholzböden auf gedämmter Unterkonstruktion",
        ],
      },
      {
        merkmal: "Sanitäreinrichtungen",
        stufen: [
          "ausreichende Anzahl von Toilettenräumen in Standard-Ausführung",
          "Toilettenräume in gehobenem Standard",
          "großzügige Toilettenanlagen jeweils mit Sanitäreinrichtung in gehobener Qualität",
        ],
      },
      {
        merkmal: "Heizung",
        stufen: [
          "elektronisch gesteuerte Fern- oder Zentralheizung, Niedertemperatur- oder Brennwertkessel",
          "Fußbodenheizung; Solarkollektoren für Warmwassererzeugung",
          "Solarkollektoren für Warmwassererzeugung und Heizung, Blockheizkraftwerk, Wärmepumpe, Hybrid-Systeme; Klimaanlage",
        ],
      },
      {
        merkmal: "Sonstige technische Ausstattung",
        stufen: [
          "zeitgemäße Anzahl an Steckdosen und Lichtauslässen; Zählerschrank (ab ca. 1985) mit Unterverteilung und Kippsicherungen; Kabelkanäle; Blitzschutz",
          "zahlreiche Steckdosen und Lichtauslässe; hochwertige Abdeckungen, hochwertige Beleuchtung; Doppelboden mit Bodentanks zur Verkabelung; ausreichende Anzahl von LAN-Anschlüssen; dezentrale Lüftung mit Wärmetauscher, Messverfahren von Verbrauch, Regelung von Raumtemperatur und Raumfeuchte, Sonnenschutzsteuerung; elektronische Zugangskontrolle; Personenaufzugsanlagen",
          "Video- und zentrale Alarmanlage; zentrale Lüftung mit Wärmetauscher, Klimaanlage; Bussystem; aufwendige Personenaufzugsanlagen",
        ],
      },
    ],
  },
  {
    id: "gemeinde",
    titel: "Gemeindezentren, Saalbauten, Veranstaltungsgebäude, Kindergärten, Schulen",
    codes: ["7.1","7.2","8.1","8.2","8.3"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "ein-/zweischalige Konstruktion; Wärmedämmverbundsystem oder Wärmedämmputz (nach ca. 1995)",
          "Verblendmauerwerk, zweischalig, hinterlüftet; Vorhangfassade (z. B. Naturschiefer); Wärmedämmung (nach ca. 2005)",
          "aufwendig gestaltete Fassaden mit konstruktiver Gliederung (Säulenstellungen, Erker etc.), Sichtbeton-Fertigteile, Natursteinfassade, Elemente aus Kupfer-/Eloxalblech, mehrgeschossige Glasfassaden; stark überdurchschnittliche Dämmung",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Faserzement-Schindeln, beschichtete Betondachsteine und Tondachziegel, Folienabdichtung; Dachdämmung (nach ca. 1995)",
          "glasierte Tondachziegel; besondere Dachform; Dämmung (nach ca. 2005)",
          "hochwertige Eindeckung z. B. aus Schiefer oder Kupfer, Dachbegrünung, befahrbares Flachdach; aufwendig gegliederte Dachlandschaft, stark überdurchschnittliche Dämmung",
        ],
      },
      {
        merkmal: "Fenster und Außentüren",
        stufen: [
          "Zweifachverglasung (nach ca. 1995)",
          "Dreifachverglasung, Sonnenschutzglas, aufwendigere Rahmen, höherwertige Türanlagen",
          "große, feststehende Fensterflächen, Spezialverglasung (Schall- und Sonnenschutz); Außentüren in hochwertigen Materialien",
        ],
      },
      {
        merkmal: "Innenwände und -türen",
        stufen: [
          "nicht tragende Innenwände in massiver Ausführung bzw. mit Dämmmaterial gefüllte Ständerkonstruktionen; schwere und große Türen",
          "Sichtmauerwerk, Massivholztüren, Schiebetürelemente, Glastüren",
          "gestaltete Wandabläufe (z. B. Pfeilervorlagen, abgesetzte oder geschwungene Wandpartien); Vertäfelungen (Edelholz, Metall), Akustikputz, raumhohe aufwendige Türelemente; tlw. Automatiktüren; rollstuhlgerechte Bedienung",
        ],
      },
      {
        merkmal: "Deckenkonstruktion",
        stufen: [
          "Betondecken mit Tritt- und Luftschallschutz; einfacher Putz; abgehängte Decken",
          "Decken mit großen Spannweiten, Deckenverkleidung",
          "Decken mit größeren Spannweiten",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "Linoleum- oder Teppich-Böden besserer Art und Ausführung; Fliesen, Kunststeinplatten",
          "Natursteinplatten, hochwertige Fliesen, Terrazzobelag, hochwertige Massivholzböden auf gedämmter Unterkonstruktion",
          "hochwertiges Parkett, hochwertige Natursteinplatten, hochwertige Edelholzböden auf gedämmter Unterkonstruktion",
        ],
      },
      {
        merkmal: "Sanitäreinrichtungen",
        stufen: [
          "ausreichende Anzahl von Toilettenräumen in Standard-Ausführung",
          "Toilettenräume in gehobenem Standard",
          "großzügige Toilettenanlagen mit Sanitäreinrichtung in gehobener Qualität",
        ],
      },
      {
        merkmal: "Heizung",
        stufen: [
          "elektronisch gesteuerte Fern- oder Zentralheizung, Niedertemperatur- oder Brennwertkessel",
          "Solarkollektoren für Warmwassererzeugung; Fußbodenheizung",
          "Solarkollektoren für Warmwassererzeugung und Heizung; Blockheizkraftwerk, Wärmepumpe, Hybrid-Systeme; Klimaanlage",
        ],
      },
      {
        merkmal: "Sonstige technische Ausstattung",
        stufen: [
          "zeitgemäße Anzahl an Steckdosen und Lichtauslässen; Zählerschrank (ab 1985) mit Unterverteilung und Kippsicherungen; Kabelkanäle; Blitzschutz",
          "zahlreiche Steckdosen und Lichtauslässe; hochwertige Abdeckungen, hochwertige Beleuchtung; Doppelboden mit Bodentanks zur Verkabelung, ausreichende Anzahl von LAN-Anschlüssen; dezentrale Lüftung mit Wärmetauscher, Messverfahren von Raumtemperatur, Raumfeuchte, Verbrauch, Einzelraumregelung, Sonnenschutzsteuerung; elektronische Zugangskontrolle; Personenaufzugsanlagen",
          "Video- und zentrale Alarmanlage; zentrale Lüftung mit Wärmetauscher, Klimaanlage; Bussystem",
        ],
      },
    ],
  },
  {
    id: "heime",
    titel: "Wohnheime, Alten- oder Pflegeheime, Krankenhäuser, Tageskliniken, Beherbergungsstä",
    codes: ["9.1","9.2","10.1","10.2","11.1"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "ein-/zweischalige Konstruktion; Wärmedämmverbundsystem oder Wärmedämmputz (nach ca. 1995)",
          "Verblendmauerwerk, zweischalig, hinterlüftet, Vorhangfassade (z. B. Naturschiefer); Wärmedämmung (nach ca. 2005)",
          "aufwendig gestaltete Fassaden mit konstruktiver Gliederung (Säulenstellungen, Erker etc.), Sichtbeton-Fertigteile, Natursteinfassade, Elemente aus Kupfer-/Eloxalblech, mehrgeschossige Glasfassaden; hochwertigste Dämmung",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Faserzement-Schindeln, beschichtete Betondachsteine und Tondachziegel, Folienabdichtung; Dachdämmung (nach ca. 1995)",
          "glasierte Tondachziegel; besondere Dachformen; überdurchschnittliche Dämmung (nach ca. 2005)",
          "hochwertige Eindeckung z. B. aus Schiefer oder Kupfer, Dachbegrünung, befahrbares Flachdach; aufwendig gegliederte Dachlandschaft; sichtbare hochwertigste Dämmung",
        ],
      },
      {
        merkmal: "Fenster und Außentüren",
        stufen: [
          "Zweifachverglasung (nach ca. 1995) nur Wohnheime, Altenheime, Pflegeheime, Krankenhäuser und Tageskliniken: Automatik-Eingangstüren",
          "Dreifachverglasung, Sonnenschutzglas, aufwendigere Rahmen; nur Beherbergungsstätten und Verpflegungseinrichtungen: Automatik-Eingangstüren",
          "große, feststehende Fensterflächen, Spezialverglasung (Schall- und Sonnenschutz)",
        ],
      },
      {
        merkmal: "Innenwände und -türen",
        stufen: [
          "nicht tragende Innenwände in massiver Ausführung bzw. mit Dämmmaterial gefüllte Ständerkonstruktionen; schwere Türen; nur Wohnheime, Altenheime, Pflegeheime, Krankenhäuser und Tageskliniken: Automatik-Flurzwischentüren; rollstuhlgerechte Bedienung",
          "Sichtmauerwerk; nur Beherbergungsstätten und Verpflegungseinrichtungen: Automatik-Flurzwischentüren; rollstuhlgerechte Bedienung",
          "gestaltete Wandabläufe (z. B. Pfeilervorlagen, abgesetzte oder geschwungene Wandpartien); Akustikputz, raumhohe aufwendige Türelemente",
        ],
      },
      {
        merkmal: "Deckenkonstruktion und Treppen",
        stufen: [
          "Betondecken mit Tritt- und Luftschallschutz; Deckenverkleidung, einfacher Putz",
          "Decken mit großen Spannweiten",
          "Decken mit größeren Spannweiten; hochwertige breite Stahlbeton-, Metalltreppenanlage mit hochwertigem Geländer",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "Linoleum- oder PVC-Böden besserer Art und Ausführung; Fliesen, Kunststeinplatten",
          "Natursteinplatten, hochwertige Fliesen, Terrazzobelag, hochwertige Massivholzböden auf gedämmter Unterkonstruktion",
          "hochwertiges Parkett, hochwertige Natursteinplatten, hochwertige Edelholzböden auf gedämmter Unterkonstruktion",
        ],
      },
      {
        merkmal: "Sanitäreinrichtungen",
        stufen: [
          "mehrere WCs und Duschbäder je Geschoss; Waschbecken im Raum",
          "je Raum ein Duschbad mit WC nur Wohnheime, Altenheime, Pflegeheime, Krankenhäuser und Tageskliniken: behindertengerecht",
          "je Raum ein Duschbad mit WC in guter Ausstattung; nur Wohnheime, Altenheime, Pflegeheime, Krankenhäuser und Tageskliniken: behindertengerecht",
        ],
      },
      {
        merkmal: "Heizung",
        stufen: [
          "elektronisch gesteuerte Fern- oder Zentralheizung, Niedertemperatur- oder Brennwertkessel",
          "Solarkollektoren für Warmwassererzeugung",
          "Solarkollektoren für Warmwassererzeugung und Heizung; Blockheizkraftwerk, Wärmepumpe, Hybrid-Systeme; Klimaanlage",
        ],
      },
      {
        merkmal: "Sonstige technische Ausstattung",
        stufen: [
          "zeitgemäße Anzahl an Steckdosen und Lichtauslässen; Blitzschutz, Personenaufzugsanlagen",
          "zahlreiche Steckdosen und Lichtauslässe; hochwertige Abdeckungen; dezentrale Lüftung mit Wärmetauscher; mehrere LAN- und Fernsehanschlüsse",
          "Video- und zentrale Alarmanlage, zentrale Lüftung mit Wärmetauscher, Klimaanlage, Bussystem; aufwendige Aufzugsanlagen",
        ],
      },
    ],
  },
  {
    id: "sport",
    titel: "Sporthallen, Freizeitbäder oder Heilbäder",
    codes: ["12.1","12.2","12.3","12.4"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "ein-/zweischalige Konstruktion; Wärmedämmverbundsystem oder Wärmedämmputz (nach ca. 1995)",
          "Verblendmauerwerk, zweischalig, hinterlüftet; Vorhangfassade (z. B. Naturschiefer); Wärmedämmung (nach ca. 2005)",
          "aufwendig gestaltete Fassaden mit konstruktiver Gliederung (Säulenstellungen, Erker etc.), Sichtbeton-Fertigteile, Elemente aus Kupfer-/Eloxalblech, mehrgeschossige Glasfassaden; hochwertigste Dämmung",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Faserzement-Schindeln, beschichtete Betondachsteine und Tondachziegel, Folienabdichtung; Dachdämmung (nach ca. 1995)",
          "glasierte Tondachziegel; besondere Dachformen, überdurchschnittliche Dämmung (nach ca. 2005)",
          "hochwertige Eindeckung z. B. aus Schiefer oder Kupfer, Dachbegrünung; aufwendig gegliederte Dachlandschaft, sichtbare Bogendachkonstruktionen; hochwertigste Dämmung",
        ],
      },
      {
        merkmal: "Fenster und Außentüren",
        stufen: [
          "Zweifachverglasung (nach ca. 1995)",
          "Dreifachverglasung, Sonnenschutzglas, aufwendigere Rahmen, höherwertige Türanlagen",
          "große, feststehende Fensterflächen, Spezialverglasung (Schall- und Sonnenschutz); Automatik-Eingangstüren",
        ],
      },
      {
        merkmal: "Innenwände und -türen",
        stufen: [
          "nicht tragende Innenwände in massiver Ausführung bzw. mit Dämmmaterial gefüllte Ständerkonstruktionen; schwere Türen",
          "Sichtmauerwerk; rollstuhlgerechte Bedienung",
          "gestaltete Wandabläufe (z. B. Pfeilervorlagen, abgesetzte oder geschwungene Wandpartien); Akustikputz, raumhohe aufwendige Türelemente",
        ],
      },
      {
        merkmal: "Deckenkonstruktion und Treppen",
        stufen: [
          "Betondecke",
          "Decken mit großen Spannweiten",
          "Decken mit größeren Spannweiten; hochwertige breite Stahlbeton-, Metalltreppenanlage mit hochwertigem Geländer",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "nur Sporthallen: Beton, Asphaltbeton, Estrich oder Gussasphalt auf Beton; Teppichbelag, PVC; nur Freizeitbäder/Heilbäder: Fliesenbelag",
          "nur Sporthallen: hochwertigere flächenstatische Fußbodenkonstruktion, Spezialteppich mit Gummigranulatauflage; hochwertigerer Schwingboden",
          "nur Sporthallen: hochwertigste flächenstatische Fußbodenkonstruktion, Spezialteppich mit Gummigranulatauflage; hochwertigster Schwingboden; nur Freizeitbäder/Heilbäder: hochwertiger Fliesenbelag und Natursteinboden",
        ],
      },
      {
        merkmal: "Sanitäreinrichtungen",
        stufen: [
          "wenige Toilettenräume und Duschräume bzw. Waschräume",
          "ausreichende Anzahl von Toilettenräumen und Duschräumen in besserer Qualität",
          "großzügige Toilettenanlagen und Duschräume mit Sanitäreinrichtung in gehobener Qualität",
        ],
      },
      {
        merkmal: "Heizung",
        stufen: [
          "elektronisch gesteuerte Fern- oder Zentralheizung, Niedertemperatur- oder Brennwertkessel",
          "Fußbodenheizung; Solarkollektoren für Warmwassererzeugung",
          "Solarkollektoren für Warmwassererzeugung und Heizung, Blockheizkraftwerk, Wärmepumpe, Hybrid-Systeme",
        ],
      },
      {
        merkmal: "Sonstige technische Ausstattung",
        stufen: [
          "zeitgemäße Anzahl an Steckdosen und Lichtauslässen; Blitzschutz",
          "zahlreiche Steckdosen und Lichtauslässe, hochwertige Abdeckungen, Lüftung mit Wärmetauscher",
          "Video- und zentrale Alarmanlage; Klimaanlage; Bussystem",
        ],
      },
    ],
  },
  {
    id: "maerkte",
    titel: "Verbrauchermärkte, Kauf- oder Warenhäuser, Autohäuser",
    codes: ["13.1","13.2","13.3"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "ein-/zweischalige Konstruktion, Wärmedämmverbundsystem oder Wärmedämmputz (nach ca. 1995)",
          "Verblendmauerwerk, zweischalig, hinterlüftet; Vorhangfassade (z. B. Naturschiefer); Wärmedämmung (nach ca. 2005)",
          "aufwendig gestaltete Fassaden mit konstruktiver Gliederung (Säulenstellungen, Erker etc.), Sichtbeton-Fertigteile, Natursteinfassade, Elemente aus Kupfer-/Eloxalblech, mehrgeschossige Glasfassaden; hochwertigste Dämmung",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Faserzement-Schindeln, beschichtete Betondachsteine und Tondachziegel, Folienabdichtung; Rinnen und Fallrohre aus Zinkblech; Dachdämmung (nach ca. 1995)",
          "glasierte Tondachziegel; besondere Dachform; überdurchschnittliche Dämmung (nach ca. 2005)",
          "hochwertige Eindeckung z. B. aus Schiefer oder Kupfer, Dachbegrünung; aufwendig gegliederte Dachlandschaft; hochwertigste Dämmung",
        ],
      },
      {
        merkmal: "Fenster und Außentüren",
        stufen: [
          "Zweifachverglasung (nach ca. 1995)",
          "Dreifachverglasung, Sonnenschutzglas, aufwendigere Rahmen, höherwertige Türanlagen",
          "große, feststehende Fensterflächen, Spezialverglasung (Schall- und Sonnenschutz); Außentüren in hochwertigen Materialien",
        ],
      },
      {
        merkmal: "Innenwände und -türen",
        stufen: [
          "nicht tragende Innenwände in massiver Ausführung bzw. mit Dämmmaterial gefüllte Ständerkonstruktionen; schwere Türen",
          "Sichtmauerwerk",
          "gestaltete Wandabläufe (z. B. Pfeilervorlagen, abgesetzte oder geschwungene Wandpartien); Akustikputz, raumhohe aufwendige Türelemente; rollstuhlgerechte Bedienung, Automatiktüren",
        ],
      },
      {
        merkmal: "Deckenkonstruktion",
        stufen: [
          "Betondecken mit Tritt- und Luftschallschutz, einfacher Putz, Deckenverkleidung",
          "Decken mit großen Spannweiten",
          "Decken mit größeren Spannweiten, Deckenvertäfelungen (Edelholz, Metall)",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "Linoleum- oder Teppich-Böden besserer Art und Ausführung; Fliesen, Kunststeinplatten",
          "Natursteinplatten, Fertigparkett, hochwertige Fliesen, Terrazzobelag, hochwertige Massivholzböden auf gedämmter Unterkonstruktion",
          "hochwertiges Parkett, hochwertige Natursteinplatten, hochwertige Edelholzböden auf gedämmter Unterkonstruktion",
        ],
      },
      {
        merkmal: "Sanitäreinrichtungen",
        stufen: [
          "Toilettenräume",
          "ausreichende Anzahl von Toilettenräumen, jeweils in gehobenem Standard",
          "großzügige Toilettenanlagen mit Sanitäreinrichtung in gehobener Qualität",
        ],
      },
      {
        merkmal: "Heizung",
        stufen: [
          "elektronisch gesteuerte Fern- oder Zentralheizung; Niedertemperatur- oder Brennwertkessel",
          "Fußbodenheizung; Solarkollektoren für Warmwassererzeugung",
          "Solarkollektoren für Warmwassererzeugung und Heizung; Blockheizkraftwerk, Wärmepumpe, Hybrid-Systeme; Klimaanlage",
        ],
      },
      {
        merkmal: "Sonstige technische Ausstattung",
        stufen: [
          "zeitgemäße Anzahl an Steckdosen und Lichtauslässen, Zählerschrank (ab 1985) mit Unterverteilung und Kippsicherungen; Kabelkanäle; Blitzschutz; Personenaufzugsanlagen",
          "zahlreiche Steckdosen und Lichtauslässe; hochwertige Abdeckungen, hochwertige Beleuchtung; Doppelboden mit Bodentanks zur Verkabelung, ausreichende Anzahl von LAN-Anschlüssen; dezentrale Lüftung mit Wärmetauscher, Messverfahren von Raumtemperatur, Raumfeuchte, Verbrauch, Einzelraumregelung, Sonnenschutzsteuerung",
          "Video- und zentrale Alarmanlage; zentrale Lüftung mit Wärmetauscher, Klimaanlage; Bussystem; Doppelboden mit Bodentanks zur Verkabelung; aufwendigere Aufzugsanlagen",
        ],
      },
    ],
  },
  {
    id: "betrieb",
    titel: "Betriebs- oder Werkstätten, Produktionsgebäude, Lagergebäude",
    codes: ["15.1","15.2","15.3","15.4","15.5","16.1","16.2","16.3"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "ein-/zweischaliges Mauerwerk, z. B. aus Leichtziegeln, Kalksandsteinen, Gasbetonsteinen; Edelputz; gedämmte Metall-Sandwichelemente; Wärmedämmverbundsystem oder Wärmedämmputz (nach ca. 1995)",
          "Verblendmauerwerk, zweischalig, hinterlüftet; Vorhangfassade (z. B. Naturschiefer); Wärmedämmung (nach ca. 2005)",
          "Sichtbeton-Fertigteile; Natursteinfassade, Elemente aus Kupfer-/Eloxalblech; mehrgeschossige Glasfassaden; hochwertigste Dämmung",
        ],
      },
      {
        merkmal: "Konstruktion",
        stufen: [
          "Stahl- und Betonfertigteile",
          "überwiegend Betonfertigteile; große stützenfreie Spannweiten; hohe Deckenhöhen; hohe Belastbarkeit der Decken und Böden",
          "größere stützenfreie Spannweiten; hohe Deckenhöhen; höhere Belastbarkeit der Decken und Böden",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Faserzement-Schindeln, beschichtete Betondachsteine und Tondachziegel; Folienabdichtung; Dachdämmung (nach ca. 1995)",
          "schweres Massivflachdach; besondere Dachformen; überdurchschnittliche Dämmung (nach ca. 2005)",
          "hochwertige Eindeckung z. B. aus Schiefer oder Kupfer, hochwertigste Dämmung",
        ],
      },
      {
        merkmal: "Fenster und Außentüren",
        stufen: [
          "Zweifachverglasung (nach ca. 1995)",
          "Dreifachverglasung, Sonnenschutzglas, aufwendigere Rahmen; höherwertige Türanlage",
          "große, feststehende Fensterflächen, Spezialverglasung (Schall- und Sonnenschutz); Außentüren in hochwertigen Materialien",
        ],
      },
      {
        merkmal: "Innenwände und -türen",
        stufen: [
          "Anstrich",
          "tlw. gefliest, Sichtmauerwerk; Schiebetürelemente, Glastüren",
          "überwiegend gefliest; Sichtmauerwerk; gestaltete Wandabläufe",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "Beton",
          "Estrich, Gussasphalt",
          "beschichteter Beton oder Estrichboden; Betonwerkstein, Verbundpflaster",
        ],
      },
      {
        merkmal: "Sanitäreinrichtungen",
        stufen: [
          "einfache und wenige Toilettenräume",
          "ausreichende Anzahl von Toilettenräumen",
          "großzügige Toilettenanlagen",
        ],
      },
      {
        merkmal: "Heizung",
        stufen: [
          "elektronisch gesteuerte Fern- oder Zentralheizung; Niedertemperatur- oder Brennwertkessel",
          "Fußbodenheizung; Solarkollektoren für Warmwassererzeugung; zusätzlicher Kaminanschluss",
          "Solarkollektoren für Warmwassererzeugung und Heizung; Blockheizkraftwerk; Wärmepumpe; Hybrid-Systeme; aufwendige zusätzliche Kaminanlage",
        ],
      },
      {
        merkmal: "Sonstige technische Ausstattung",
        stufen: [
          "zeitgemäße Anzahl an Steckdosen und Lichtauslässen; Blitzschutz; Teeküchen",
          "zahlreiche Steckdosen und Lichtauslässe; hochwertige Abdeckungen; Kabelkanäle; dezentrale Lüftung mit Wärmetauscher; kleinere Einbauküchen mit Kochgelegenheit, Aufenthaltsräume; Aufzugsanlagen",
          "Video- und zentrale Alarmanlage; zentrale Lüftung mit Wärmetauscher, Klimaanlage; Bussystem; Küchen, Kantinen; aufwendigere Aufzugsanlagen",
        ],
      },
    ],
  },
  {
    id: "reithallen",
    titel: "Reithallen",
    codes: ["18.1.1"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "Holzfachwerkwand; Holzstützen, Vollholz; Brettschalung oder Profilblech auf Holz-Unterkonstruktion",
          "Kalksandstein- oder Ziegel-Mauerwerk; Metallstützen, Profil; Holz-Blockbohlen zwischen Stützen, Wärmedämmverbundsystem, Putz",
          "Betonwand, Fertigteile, mehrschichtig; Stahlbetonstützen, Fertigteil; Kalksandstein-Vormauerung oder Klinkerverblendung mit Dämmung",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Holzkonstruktionen, Nagelbrettbinder; Bitumenwellplatten, Profilblech",
          "Stahlrahmen mit Holzpfetten; Faserzementwellplatten; Hartschaumplatten",
          "Brettschichtholzbinder; Betondachsteine oder Dachziegel; Dämmung mit Profilholz oder Paneelen",
        ],
      },
      {
        merkmal: "Fenster und Außentüren bzw. -tore",
        stufen: [
          "Lichtplatten aus Kunststoff, Holz-Brettertüren",
          "Kunststofffenster, Windnetze aus Kunststoff, Jalousien mit Motorantrieb",
          "Türen und Tore mehrschichtig mit Wärmedämmung, Holzfenster, hoher Fensteranteil",
        ],
      },
      {
        merkmal: "Innenwände",
        stufen: [
          "keine",
          "tragende bzw. nicht tragende Innenwände aus Holz; Anstrich",
          "tragende bzw. nicht tragende Innenwände als Mauerwerk; Sperrholz, Gipskarton, Fliesen",
        ],
      },
      {
        merkmal: "Deckenkonstruktion",
        stufen: [
          "keine",
          "Holzkonstruktionen über Nebenräumen; Hartschaumplatten",
          "Stahlbetonplatte über Nebenräumen; Dämmung mit Profilholz oder Paneelen",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "Tragschicht: Schotter, Trennschicht: Vlies, Tretschicht: Sand",
          "zusätzlich/alternativ: Tragschicht: Schotter, Trennschicht: Kunststoffgewebe, Tretschicht: Sand und Holzspäne",
          "Estrich auf Dämmung, Fliesen oder Linoleum in Nebenräumen; zusätzlich/alternativ: Tragschicht: Schotter, Trennschicht: Kunststoffplatten, Tretschicht: Sand und Textilflocken, Betonplatte im Bereich der Nebenräume",
        ],
      },
      {
        merkmal: "baukonstruktive Einbauten",
        stufen: [
          "Reithallenbande aus Nadelholz zur Abgrenzung der Reitfläche",
          "zusätzlich/alternativ: Vollholztafeln fest eingebaut",
          "zusätzlich/alternativ: Vollholztafeln, Fertigteile zum Versetzen",
        ],
      },
      {
        merkmal: "Abwasser-, Wasser-, Gasanlagen",
        stufen: [
          "Regenwasserableitung",
          "zusätzlich/alternativ: Abwasserleitungen, Sanitärobjekte (einfache Qualität)",
          "zusätzlich/alternativ: Sanitärobjekte (gehobene Qualität), Gasanschluss",
        ],
      },
      {
        merkmal: "Wärmeversorgungsanlagen",
        stufen: [
          "keine",
          "Raumheizflächen in Nebenräumen, Anschluss an Heizsystem",
          "zusätzlich/alternativ: Heizkessel",
        ],
      },
      {
        merkmal: "lufttechnische Anlagen",
        stufen: [
          "keine",
          "Firstentlüftung",
          "Be- und Entlüftungsanlage",
        ],
      },
      {
        merkmal: "Starkstrom-Anlage",
        stufen: [
          "Leitungen, Schalter, Dosen, Langfeldleuchten",
          "zusätzlich/alternativ: Sicherungen und Verteilerschrank",
          "zusätzlich/alternativ: Metall-Dampfleuchten",
        ],
      },
      {
        merkmal: "nutzungsspezifische Anlagen",
        stufen: [
          "keine",
          "Reitbodenbewässerung (einfache Ausführung)",
          "Reitbodenbewässerung (komfortable Ausführung)",
        ],
      },
    ],
  },
  {
    id: "pferdestaelle",
    titel: "Pferdeställe",
    codes: ["18.1.2"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "Holzfachwerkwand; Holzstützen, Vollholz; Brettschalung oder Profilblech auf Holz-Unterkonstruktion",
          "Kalksandstein- oder Ziegel-Mauerwerk; Metallstützen, Profil; Holz-Blockbohlen zwischen Stützen, Wärmedämmverbundsystem, Putz",
          "Betonwand, Fertigteile, mehrschichtig; Stahlbetonstützen, Fertigteil; Kalksandstein-Vormauerung oder Klinkerverblendung mit Dämmung",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Holzkonstruktionen, Vollholzbalken; Nagelbrettbinder; Bitumenwellplatten, Profilblech",
          "Stahlrahmen mit Holzpfetten; Faserzementwellplatten; Hartschaumplatten",
          "Brettschichtholzbinder; Betondachsteine oder Dachziegel; Dämmung mit Profilholz oder Paneelen",
        ],
      },
      {
        merkmal: "Fenster und Außentüren bzw. -tore",
        stufen: [
          "Lichtplatten aus Kunststoff, Holz-Brettertüren",
          "Kunststofffenster, Windnetze aus Kunststoff, Jalousien mit Motorantrieb",
          "Türen und Tore mehrschichtig mit Wärmedämmung, Holzfenster, hoher Fensteranteil",
        ],
      },
      {
        merkmal: "Innenwände",
        stufen: [
          "keine",
          "tragende bzw. nicht tragende Innenwände aus Holz; Anstrich",
          "tragende bzw. nicht tragende Innenwände als Mauerwerk; Sperrholz, Putz, Fliesen",
        ],
      },
      {
        merkmal: "Deckenkonstruktion",
        stufen: [
          "keine",
          "Holzkonstruktionen über Nebenräumen; Hartschaumplatten",
          "Stahlbetonplatten über Nebenräumen; Dämmung mit Profilholz oder Paneelen",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "Beton-Verbundpflaster in Stallgassen, Stahlbetonplatte im Tierbereich",
          "zusätzlich/alternativ: Stahlbetonplatte; Anstrich, Gummimatten im Tierbereich",
          "zusätzlich/alternativ: Stahlbetonplatte als Stallprofil mit versetzten Ebenen; Nutzestrich auf Dämmung, Anstrich oder Fliesen in Nebenräumen, Kautschuk im Tierbereich",
        ],
      },
      {
        merkmal: "baukonstruktive Einbauten",
        stufen: [
          "Fütterung: Futtertrog PVC",
          "Fütterung: Krippenschalen aus Polyesterbeton",
          "Fütterung: Krippenschalen aus Steinzeug",
        ],
      },
      {
        merkmal: "Abwasser-, Wasser-, Gasanlagen",
        stufen: [
          "Regenwasserableitung, Wasserleitung",
          "zusätzlich/alternativ: Abwasserleitungen, Sanitärobjekte (einfache Qualität) in Nebenräumen",
          "zusätzlich/alternativ: Sanitärobjekte (gehobene Qualität), Gasanschluss",
        ],
      },
      {
        merkmal: "Wärmeversorgungsanlagen",
        stufen: [
          "keine",
          "Elektroheizung in Sattelkammer",
          "zusätzlich/alternativ: Raumheizflächen, Heizkessel",
        ],
      },
      {
        merkmal: "lufttechnische Anlagen",
        stufen: [
          "keine",
          "Firstentlüftung",
          "Be- und Entlüftungsanlage",
        ],
      },
      {
        merkmal: "Starkstrom-Anlage",
        stufen: [
          "Leitungen, Schalter, Dosen, Langfeldleuchten",
          "zusätzlich/alternativ: Sicherungen und Verteilerschrank",
          "zusätzlich/alternativ: Metall-Dampfleuchten",
        ],
      },
      {
        merkmal: "nutzungsspezifische Anlagen",
        stufen: [
          "Aufstallung: Boxentrennwände aus Holz, Anbindevorrichtungen Fütterung: Tränken, Futterraufen",
          "Aufstallung: zusätzlich/alternativ: Boxentrennwände: Hartholz/Metall Fütterung: zusätzlich/alternativ: Fressgitter, Futterautomaten, Rollraufe mit elektr. Steuerung",
          "Aufstallung: zusätzlich/alternativ: Komfort-Pferdeboxen, Pferde-Solarium Fütterung: zusätzlich/alternativ: Futter-Abrufstationen für Rau- und Kraftfutter mit elektr. Tiererkennung und Selektion, Automatische Futterzuteilung für Boxenställe",
        ],
      },
    ],
  },
  {
    id: "rinder",
    titel: "Rinderställe und Melkhäuser",
    codes: ["18.2.1","18.2.2","18.2.3","18.2.4"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "Holzfachwerkwand; Holzstützen, Vollholz; Brettschalung oder Profilblech auf Holz-Unterkonstruktion",
          "Kalksandstein- oder Ziegel-Mauerwerk; Metallstützen, Profil; Holz-Blockbohlen zwischen Stützen",
          "Betonwand, Fertigteile, mehrschichtig; Stahlbetonstützen, Fertigteil; Klinkerverblendung",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Holzkonstruktionen, Vollholzbalken, Nagelbrettbinder; Bitumenwellplatten, Profilblech",
          "Stahlrahmen mit Holzpfetten; Faserzementwellplatten; Hartschaumplatten",
          "Brettschichtholzbinder; Betondachsteine oder Dachziegel; Dämmung mit Profilholz oder Paneelen",
        ],
      },
      {
        merkmal: "Fenster und Außentüren bzw. -tore",
        stufen: [
          "Lichtplatten aus Kunststoff",
          "Kunststofffenster, Windnetze aus Kunststoff, Jalousien mit Motorantrieb",
          "Türen und Tore mehrschichtig mit Wärmedämmung, Holzfenster, hoher Fensteranteil",
        ],
      },
      {
        merkmal: "Innenwände",
        stufen: [
          "keine",
          "tragende und nicht tragende Innenwand aus Holz; Anstrich",
          "tragende und nicht tragende Innenwände aus Mauerwerk; Sperrholz, Putz, Fliesen",
        ],
      },
      {
        merkmal: "Deckenkonstruktion",
        stufen: [
          "keine",
          "Holzkonstruktionen über Nebenräumen; Hartschaumplatten",
          "Stahlbetonplatte über Nebenräumen; Dämmung mit Profilholz oder Paneelen",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "Stahlbetonplatte",
          "zusätzlich/alternativ: Stahlbetonplatte mit Oberflächenprofil, Rautenmuster; Epoxidharzbeschichtung am Fressplatz, Liegematten im Tierbereich",
          "zusätzlich/alternativ: Stahlbetonplatte als Stallprofil mit versetzten Ebenen; Estrich auf dem Futtertisch, Liegematratzen im Tierbereich, Gussasphalt oder Gummiauflage",
        ],
      },
      {
        merkmal: "baukonstruktive Einbauten",
        stufen: [
          "Aufstallung: Beton-Spaltenboden, Einzelbalken",
          "Aufstallung: Beton-Spaltenboden, Flächenelemente; Krippenschalen aus Polyesterbeton; Güllerohre vom Stall zum Außenbehälter",
          "Aufstallung: Spaltenboden mit Gummiauflage, Gussroste über Treibmistkanal; Krippenschalen aus Steinzeug; zusätzlich/alternativ: Spülleitungen für Einzelkanäle",
        ],
      },
      {
        merkmal: "Abwasser-, Wasser-, Gasanlagen",
        stufen: [
          "Regenwasserableitung; Wasserleitung",
          "zusätzlich/alternativ: Abwasserleitungen, Sanitärobjekte (einfache Qualität) in Nebenräumen",
          "zusätzlich/alternativ: Sanitärobjekte (gehobene Qualität); Gasanschluss",
        ],
      },
      {
        merkmal: "Wärme-, Versorgungsanlagen",
        stufen: [
          "keine",
          "Elektroheizung im Melkstand",
          "zusätzlich/alternativ: Raumheizflächen, Heizkessel",
        ],
      },
      {
        merkmal: "lufttechnische Anlagen",
        stufen: [
          "keine",
          "Firstentlüftung",
          "Be- und Entlüftungsanlage",
        ],
      },
      {
        merkmal: "Starkstrom-Anlage",
        stufen: [
          "Leitungen, Schalter, Dosen, Langfeldleuchten",
          "zusätzlich/alternativ: Sicherungen und Verteilerschrank",
          "zusätzlich/alternativ: Metall-Dampfleuchten",
        ],
      },
      {
        merkmal: "nutzungsspezifische Anlagen",
        stufen: [
          "Aufstallung: Fressgitter, Liegeboxenbügel, Kälberboxen, Abtrennungen aus Holz, Kurzstandanbindung Fütterung: Selbsttränke, Balltränke Entmistung: keine Technik (Schlepper) Tierproduktentnahme: Fischgrätenmelkstand, Melkanlage, Maschinensatz, Milchkühltank, Kühlaggregat, Wärmerückgewinnung",
          "Aufstallung: zusätzlich/alternativ: Einrichtungen aus verz. Stahlrohren Fütterung: Tränkewanne mit Schwimmer, Tränkeautomat für Kälber Entmistung: Faltschieber mit Seilzug und Antrieb, Tauchschneidpumpe, Rührmixer Tierproduktentnahme: zusätzlich/alternativ Milchflussgesteuerte Anrüst- und Abschaltautomatik",
          "Aufstallung: zusätzlich/alternativ: Komfortboxen Fütterung: Edelstahl-Kipptränke, computergesteuerte Kraftfutteranlage mit Tiererkennung Entmistung: Schubstangenentmistung Tierproduktentnahme: zusätzlich/alternativ: Melkstand-Schnellaustrieb, Tandem oder Karussellmelkstand, Automatisches Melksystem (Roboter)",
        ],
      },
    ],
  },
  {
    id: "schweine",
    titel: "Schweineställe",
    codes: ["18.3.1","18.3.2","18.3.3","18.3.4"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "Holzfachwerkwand; Holzstützen, Vollholz; Brettschalung oder Profilblech auf Holz-Unterkonstruktion",
          "Kalksandstein- oder Ziegel-Mauerwerk; Metallstützen, Profil; Holz-Blockbohlen zwischen Stützen, Beton-Schalungssteine mit Putz",
          "Betonwand, Fertigteile, mehrschichtig; Stahlbetonstützen, Fertigteil; Kalksandstein-Vormauerung oder Klinkerverblendung mit Dämmung",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Holzkonstruktionen, Vollholzbalken; Nagelbrettbinder; Bitumenwellplatten, Profilblech",
          "Stahlrahmen mit Holzpfetten; Faserzementwellplatten; Hartschaumplatten",
          "Brettschichtholzbinder; Betondachsteine oder Dachziegel; Dämmung, Kunststoffplatten, Paneele",
        ],
      },
      {
        merkmal: "Fenster und Außentüren bzw. -tore",
        stufen: [
          "Lichtplatten aus Kunststoff, Holz-Brettertüren",
          "Kunststofffenster, Windnetze aus Kunststoff, Jalousien mit Motorantrieb, Metalltüren",
          "Türen und Tore mehrschichtig mit Wärmedämmung, Holzfenster, hoher Fensteranteil",
        ],
      },
      {
        merkmal: "Innenwände",
        stufen: [
          "keine Innenwände",
          "tragende Innenwände aus Mauerwerk, Putz und Anstrich; nichttragende Innenwände aus Kunststoff-Paneele mit Anstrich",
          "tragende Innenwände als Betonwand, Fertigteile, Anstrich; nichttragende Innenwände aus Mauerwerk, Putz und Anstrich; Sperrholz, Putz, Fliesen",
        ],
      },
      {
        merkmal: "Deckenkonstruktion",
        stufen: [
          "keine Decke",
          "Holzkonstruktionen über Nebenräumen; Hartschaumplatten",
          "Stahlbetonplatten über Nebenräumen; Dämmung, Kunststoffplatten, Paneele",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "Stahlbetonplatte",
          "Stahlbetonplatte; Verbundestrich",
          "zusätzlich/alternativ: Stahlbetonplatte als Stallprofil mit versetzten Ebenen; Stallbodenplatten mit Dämmung, Fliesen auf Estrich in Nebenräumen",
        ],
      },
      {
        merkmal: "baukonstruktive Einbauten",
        stufen: [
          "Fütterung: Tröge aus Polyesterbeton",
          "Aufstallung: Beton-Spaltenboden, Flächenelemente Fütterung: Tröge aus Polyesterbeton Entmistung: Güllerohre vom Stall zum Außenbehälter, Absperrschieber in Güllekanälen",
          "Aufstallung: Gussroste in Sauenställen, Kunststoffroste in Ferkelställen Fütterung: Tröge aus Steinzeug Entmistung: zusätzlich/alternativ: Spülleitungen für Einzelkanäle",
        ],
      },
      {
        merkmal: "Abwasser-, Wasser-, Gasanlagen",
        stufen: [
          "Regenwasserableitung, Wasserleitung",
          "zusätzlich/alternativ: Abwasserleitungen, Sanitärobjekte (einfache Qualität) in Nebenräumen",
          "zusätzlich/alternativ: Sanitärobjekte (gehobene Qualität), Gasanschluss",
        ],
      },
      {
        merkmal: "Wärmeversorgungsanlagen",
        stufen: [
          "Warmluftgebläse, Elt.-Anschluss",
          "Raumheizflächen oder Twin- bzw. Delta-Heizungsrohren, Anschluss an vorh. Heizsystem",
          "zusätzlich/alternativ: Warmwasser-Fußbodenheizung, Heizkessel mit Gasbefeuerung, Wärmerückgewinnung aus Stallluft",
        ],
      },
      {
        merkmal: "lufttechnische Anlagen",
        stufen: [
          "Zuluftklappen, Lüftungsfirst",
          "Be- und Entlüftungsanlage im Unterdruckverfahren; Zuluftkanäle oder Rieseldecke; Einzelabsaugung, Abluftkanäle, Ventilatoren",
          "zusätzlich/alternativ: Gleichdrucklüftung, Zentralabsaugung, Luftwäscher",
        ],
      },
      {
        merkmal: "Starkstrom-Anlage",
        stufen: [
          "Leitungen, Schalter, Dosen, Langfeldleuchten",
          "zusätzlich/alternativ: Sicherungen und Verteilerschrank",
          "zusätzlich/alternativ: Metall-Dampfleuchten",
        ],
      },
      {
        merkmal: "nutzungsspezifische Anlagen",
        stufen: [
          "Aufstallung: Buchtenabtrennungen aus Kunststoff-Paneelen, Pfosten und Beschläge aus verz. Stahl, Abferkelbuchten, Selbstfang-Kastenstände für Sauen Fütterung: Trockenfutterautomaten, Tränkenippel",
          "Aufstallung: zusätzlich/alternativ: Pfosten und Beschläge aus V2A, Ruhekisten, Betteneinrichtungen Fütterung: zusätzlich/alternativ: Transportrohre, Drahtseilförderer, Rohrbreiautomaten mit Dosierung Entmistung: Tauchschneidpumpe, Rührmixer",
          "Aufstallung: zusätzlich/alternativ: Sortierschleuse Fütterung: zusätzlich/alternativ: Flüssigfütterungsanlage mit Mixbehälter, Sensorsteuerung, Fütterungscomputer, Abrufstation, Tiererkennung, Selektion Entmistung: Schubstangenentmistung",
        ],
      },
    ],
  },
  {
    id: "gefluegel",
    titel: "Geflügelställe",
    codes: ["18.4.1","18.4.2","18.4.3","18.4.4"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "Holzfachwerkwand, Holzstützen, Vollholz, Brettschalung oder Profilblech auf Holz-Unterkonstruktion",
          "Kalksandstein- oder Ziegel-Mauerwerk, Metallstützen, Profil, Metall-Sandwichelemente mit Hartschaumdämmung",
          "Betonwand, Fertigteile, mehrschichtig, Stahlbetonstützen, Fertigteil, Klinkerverblendung",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Holzkonstruktionen, Vollholzbalken, Nagelbrettbinder, Bitumenwellplatten, Profilblech",
          "Stahlrahmen mit Holzpfetten, Faserzementwellplatten, Hartschaumplatten",
          "Brettschichtholzbinder, Betondachsteine oder Dachziegel, Dämmung, Profilholz oder Paneele",
        ],
      },
      {
        merkmal: "Fenster und Außentüren bzw. -tore",
        stufen: [
          "Lichtplatten aus Kunststoff; Holz-Brettertüren",
          "Kunststofffenster; Windnetze aus Kunststoff, Jalousien mit Motorantrieb",
          "Türen und Tore mehrschichtig mit Wärmedämmung, Holzfenster, hoher Fensteranteil",
        ],
      },
      {
        merkmal: "Innenwände",
        stufen: [
          "keine",
          "tragende bzw. nicht tragende Innenwände aus Holz; Anstrich",
          "tragende bzw. nicht tragende Innenwände als Mauerwerk; Profilblech, Plantafeln, Putz",
        ],
      },
      {
        merkmal: "Deckenkonstruktion",
        stufen: [
          "keine",
          "Holzkonstruktionen über Nebenräumen; Hartschaumplatten",
          "Stahlbetonplatten über Nebenräumen; Dämmung, Profilblech oder Paneelen",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "Stahlbetonplatte",
          "zusätzlich/alternativ: Oberfläche maschinell geglättet; Estrich mit Anstrich (Eierverpackung)",
          "zusätzlich/alternativ: Stallprofil mit versetzten Ebenen, Estrich mit Fliesen (Eierverpackung)",
        ],
      },
      {
        merkmal: "Abwasser-, Wasser-, Gasanlagen",
        stufen: [
          "Regenwasserableitung, Wasserleitung",
          "zusätzlich/alternativ: Abwasserleitungen, Sanitärobjekte (einfache Qualität) in Nebenräumen",
          "zusätzlich/alternativ: Sanitärobjekte (gehobene Qualität), Gasanschluss",
        ],
      },
      {
        merkmal: "Wärmeversorgungsanlagen",
        stufen: [
          "Warmluftgebläse, Elt.-Anschluss",
          "zusätzlich/alternativ: Raumheizflächen oder Twin- bzw. Delta-Heizungsrohre, Heizkessel",
          "zusätzlich: Wärmerückgewinnung aus der Stallluft",
        ],
      },
      {
        merkmal: "lufttechnische Anlagen",
        stufen: [
          "Firstentlüftung",
          "Be- und Entlüftungsanlage im Unterdruckverfahren; Zuluftklappen, Abluftkamine, Ventilatoren",
          "zusätzlich/alternativ: Gleichdrucklüftung, Zentralabsaugung, Luftwäscher",
        ],
      },
      {
        merkmal: "Starkstrom-Anlage",
        stufen: [
          "Leitungen, Schalter, Dosen, Langfeldleuchten",
          "zusätzlich/alternativ: Sicherungen und Verteilerschrank",
          "zusätzlich/alternativ: Metall-Dampfleuchten",
        ],
      },
      {
        merkmal: "nutzungsspezifische Anlagen",
        stufen: [
          "Aufstallung: Geflügelwaage",
          "Aufstallung: zusätzlich/alternativ: Kotroste, Sitzstangen, Legenester Fütterung: Vollautomatische Kettenfütterung, Strang-Tränkeanlage, Nippeltränken Entmistung: Kotbandentmistung Tierproduktentnahme: Eier-Sammelband",
          "Aufstallung: zusätzlich/alternativ: Etagensystem (Voliere, Kleingruppe) Entmistung: zusätzlich/alternativ: Entmistungsbänder mit Belüftung Tierproduktentnahme: zusätzlich/alternativ: Sortieranlage, Verpackung",
        ],
      },
    ],
  },
  {
    id: "mehrzweckhallen",
    titel: "landwirtschaftliche Mehrzweckhallen",
    codes: ["18.5"],
    merkmale: [
      {
        merkmal: "Außenwände",
        stufen: [
          "Holzfachwerkwand; Holzstützen, Vollholz; Brettschalung oder Profilblech auf Holz-Unterkonstruktion",
          "Kalksandstein- oder Ziegel-Mauerwerk; Metallstützen, Profil; Holz-Blockbohlen zwischen Stützen, Wärmedämmverbundsystem, Putz",
          "Betonwand, Fertigteile, mehrschichtig; Stahlbetonstützen, Fertigteil; Kalksandstein-Vormauerung oder Klinkerverblendung mit Dämmung",
        ],
      },
      {
        merkmal: "Dach",
        stufen: [
          "Holzkonstruktionen, Nagelbrettbinder; Bitumenwellplatten, Profilblech",
          "Stahlrahmen mit Holzpfetten; Faserzementwellplatten; Hartschaumplatten",
          "Brettschichtholzbinder; Betondachsteine oder Dachziegel; Dämmung mit Profilholz oder Paneelen",
        ],
      },
      {
        merkmal: "Fenster und Außentüren bzw. -tore",
        stufen: [
          "Lichtplatten aus Kunststoff, Holztore",
          "Kunststofffenster, Metall-Sektionaltore",
          "Türen und Tore mehrschichtig mit Wärmedämmung, Holzfenster, hoher Fensteranteil",
        ],
      },
      {
        merkmal: "Innenwände",
        stufen: [
          "keine",
          "tragende bzw. nicht tragende Innenwände aus Holz; Anstrich",
          "tragende bzw. nicht tragende Innenwände als Mauerwerk; Sperrholz, Gipskarton, Fliesen",
        ],
      },
      {
        merkmal: "Deckenkonstruktion",
        stufen: [
          "keine",
          "Holzkonstruktionen über Nebenräumen; Hartschaumplatten",
          "Stahlbetonplatte über Nebenräumen; Dämmung mit Profilholz oder Paneelen",
        ],
      },
      {
        merkmal: "Fußböden",
        stufen: [
          "Beton-Verbundsteinpflaster",
          "zusätzlich/alternativ: Stahlbetonplatte",
          "zusätzlich/alternativ: Oberfläche maschinell geglättet; Anstrich",
        ],
      },
      {
        merkmal: "Abwasser-, Wasser-, Gasanlagen",
        stufen: [
          "Regenwasserableitung",
          "zusätzlich/alternativ: Abwasserleitungen, Sanitärobjekte (einfache Qualität) in Nebenräumen",
          "zusätzlich/alternativ: Sanitärobjekte (gehobene Qualität) in Nebenräumen, Gasanschluss",
        ],
      },
      {
        merkmal: "Wärmeversorgungsanlagen",
        stufen: [
          "keine",
          "Raumheizflächen in Nebenräumen, Anschluss an Heizsystem",
          "zusätzlich/alternativ: Heizkessel",
        ],
      },
      {
        merkmal: "lufttechnische Anlagen",
        stufen: [
          "keine",
          "Firstentlüftung",
          "Be- und Entlüftungsanlage",
        ],
      },
      {
        merkmal: "Starkstrom-Anlage",
        stufen: [
          "Leitungen, Schalter, Dosen, Langfeldleuchten",
          "zusätzlich/alternativ: Sicherungen und Verteilerschrank",
          "zusätzlich/alternativ: Metall-Dampfleuchten",
        ],
      },
      {
        merkmal: "nutzungsspezifische Anlagen",
        stufen: [
          "keine",
          "Schüttwände aus Holz zwischen Stahlstützen, Trocknungsanlage für Getreide",
          "Schüttwände aus Beton-Fertigteilen",
        ],
      },
    ],
  },
];

/** Amtliche Standardbeschreibungen für einen NHK-Typcode; null wenn nicht vorhanden */
export function standardsFuer(code: string): StandardsGruppe | null {
  return STANDARD_BESCHREIBUNGEN.find((g) => g.codes.includes(code)) ?? null;
}
