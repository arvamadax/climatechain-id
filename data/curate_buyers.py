"""Write data/buyers.csv: reviewed classification of the largest buyers (group, type, Climate TRACE parent).

Every row below was reviewed by hand against registry retirement details on 2026-10-20.
Types: company | intermediary (retires on behalf of clients) | public_body | anonymous | wallet | tokenization | unidentified.
Coverage: core = the group's main emissions are in Climate TRACE ownership sectors; partial = they are not.
Usage: python data/curate_buyers.py   (reads web/data/index.json, writes data/buyers.csv)
"""
import csv
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
C, I, P, A, W, T, U = "company", "intermediary", "public_body", "anonymous", "wallet", "tokenization", "unidentified"
SH, ENI, WDS, CVX, PTR, CPC, ENG = "E100000000746", "E100000000610", "E100001016083", "E100000001179", "E100000000245", "E100000001010", "E100000000382"
AGL, ORG, TG, OG, ARV, VAT, ESWE = "E100000000014", "E100000000019", "E100000000660", "E100000000654", "E100000000614", "E100000001728", "E100000000405"
SWR, ENT, FMG, VW, DAL, EON, KUN = "E100000001900", "E100000002985", "E100002011535", "E100000000459", "E100002013851", "E100000001454", "E100000000490"
HOL = "E100001000571"

# exact buyer name -> (group, type, ct_parent_id, coverage, note)
M = {
    "(no owner listed)": ("No beneficiary named", A, "", "", ""),
    "Not Disclosed": ("Beneficiary withheld", A, "", "", "registry entry says Not Disclosed"),
    "Shell": ("Shell plc", C, SH, "core", ""),
    "Eni Upstream": ("Eni SpA", C, ENI, "core", "division"),
    "DL": ('Unidentified code "DL"', U, "", "", "no retirement details; not assumed to be Delta"),
    "Eni Plenitude spa Società Benefit": ("Eni SpA", C, ENI, "core", "subsidiary (Plenitude)"),
    "TASC SA Pty Ltd (COAS account 101046)": ("TASC SA (South African carbon tax offset account)", I, "", "", "COAS: South African Carbon Offset Administration System"),
    "AUDI AG": ("Volkswagen AG", C, VW, "partial", "subsidiary (Audi)"),
    "Yamato Transport Co., Ltd.": ("Yamato Holdings", C, "", "", ""),
    "Telstra Corporation Limited": ("Telstra", C, "", "", ""),
    "PetroChina International Company Limited (“PCI”)": ("PetroChina Co Ltd", C, PTR, "core", "subsidiary (PetroChina International)"),
    "Takeda Pharmaceutical Company": ("Takeda Pharmaceutical", C, "", "", ""),
    "The Boeing Company": ("Boeing", C, "", "", ""),
    "Delta Air Lines": ("Delta Air Lines Inc", C, DAL, "partial", ""),
    "4AIR Client": ("4AIR (aviation offset provider, for clients)", I, "", "", ""),
    "Netflix, Inc.": ("Netflix, Inc.", C, "", "", ""),
    "EY Global Services Limited": ("EY", C, "", "", ""),
    "Geopost": ("Geopost (DPD group, La Poste)", C, "", "", ""),
    "Marke VW Pkw": ("Volkswagen AG", C, VW, "partial", "brand"),
    "Norwegian Cruise Line Holdings Ltd.": ("Norwegian Cruise Line Holdings", C, "", "", ""),
    "VistaJet": ("VistaJet", C, "", "", ""),
    "Guccio Gucci Spa": ("Kering (Gucci)", C, "", "", ""),
    "Volkswagen Marke Pkw": ("Volkswagen AG", C, VW, "partial", "brand"),
    "VW PKW": ("Volkswagen AG", C, VW, "partial", "brand"),
    "Woodside Burrup Pty Ltd": ("Woodside Energy Group", C, WDS, "core", "subsidiary (Burrup)"),
    "BRISBANE CITY COUNCIL": ("Brisbane City Council", P, "", "", ""),
    "Natura Cosméticos S.A.": ("Natura &Co", C, "", "", ""),
    "Skoda Auto a.s.": ("Volkswagen AG", C, VW, "partial", "subsidiary (Skoda)"),
    "CPC Corporation, Taiwan": ("CPC Corporation, Taiwan", C, CPC, "core", ""),
    "CMA CGM": ("CMA CGM", C, "", "", ""),
    "CHEVRON PETROLEUM COMPANY": ("Chevron Corp", C, CVX, "core", "subsidiary"),
    "Ecologi Action Ltd": ("Ecologi (retail offset platform)", I, "", "", ""),
    "Pangolin": ("Pangolin Associates (offset provider)", I, "", "", "retires on behalf of client buildings and organisations"),
    "Interface, Inc.": ("Interface, Inc.", C, "", "", ""),
    "easyJet": ("easyJet plc", C, "", "", ""),
    "Civitas Resources": ("Civitas Resources", C, "", "", 'retirements noted "against Scope 1 emissions"'),
    "Apple Inc.": ("Apple Inc.", C, "", "", ""),
    "4AIR": ("4AIR (aviation offset provider, for clients)", I, "", "", ""),
    "ENGIE ABN 67 269 241 237": ("ENGIE SA", C, ENG, "core", "ENGIE Australia (ABN)"),
    "Greenchoice": ("Greenchoice (energy retailer, offsets for customers)", C, "", "", ""),
    "Air Canada": ("Air Canada", C, "", "", ""),
    "Acciaieria Arvedi S.p.A.": ("Finarvedi (Arvedi steel)", C, ARV, "core", ""),
    "Salesforce, Inc.": ("Salesforce", C, "", "", ""),
    "Etsy, Inc.": ("Etsy", C, "", "", ""),
    "Powershop Australia Pty Limited": ("Powershop (energy retailer, offsets for customers)", C, "", "", ""),
    "GP-2": ('Unidentified code "GP-2"', U, "", "", ""),
    "Bayer AG": ("Bayer AG", C, "", "", ""),
    "The Walt Disney Company": ("The Walt Disney Company", C, "", "", ""),
    "GeoPost/DPDgroup - 2021 Emissions - Certificate 22/264": ("Geopost (DPD group, La Poste)", C, "", "", ""),
    "DPD Group": ("Geopost (DPD group, La Poste)", C, "", "", ""),
    "ENERGY Joburg RF (PTY) Ltd ac no: 100007": ("Energy Joburg (South African carbon tax offset account)", I, "", "", ""),
    "LichtBlick SE": ("LichtBlick (energy retailer, offsets for customers)", C, "", "", ""),
    "GASAG AG": ("GASAG (energy retailer, offsets for customers)", C, "", "", ""),
    "AGL | Perth Energy": ("AGL Energy", C, AGL, "core", "Perth Energy retail brand"),
    "Anonymous": ("Anonymous", A, "", "", ""),
    "DPDgroup": ("Geopost (DPD group, La Poste)", C, "", "", ""),
    "Hörmann KG Verkaufsgesellschaft": ("Hörmann KG (door manufacturer)", C, "", "", "not HÖRMANN Industries, a different company"),
    "Volkswagen Nutzfahrzeuge": ("Volkswagen AG", C, VW, "partial", "brand"),
    "Lidl Stiftung & Co. KG": ("Schwarz Group (Lidl)", C, "", "", ""),
    "MOSS EARTH - RETIREMENT FOR TOKENIZATION": ("Moss.Earth (tokenization)", T, "", "", "credits retired to back crypto tokens"),
    "Shaw Industries Group, Inc.": ("Berkshire Hathaway (Shaw Industries)", C, "", "", ""),
    "Church & Dwight": ("Church & Dwight", C, "", "", ""),
    "ESWE Versorgungs AG": ("ESWE Versorgungs AG", C, ESWE, "core", ""),
    "Air France": ("Air France-KLM", C, "", "", ""),
    "ENTEGA Plus GmbH": ("Entega AG", C, ENT, "core", "retail subsidiary"),
    "SEAT S.A.": ("Volkswagen AG", C, VW, "partial", "subsidiary (SEAT)"),
    "Toho Gas Co., Ltd. (retired with INPEX CORPORATION for LNG carbon offsetting)": ("Toho Gas", C, "", "", "retired with INPEX for carbon-offset LNG"),
    "Osaka Gas Co., Ltd.": ("Osaka Gas", C, OG, "core", ""),
    "PwC International Limited": ("PwC", C, "", "", ""),
    "WeAct Pty Ltd. with COAS account 101017.": ("WeAct (South African carbon tax offset account)", I, "", "", ""),
    "Chanel": ("Chanel", C, "", "", ""),
    "PRIMAKLIMA e.V.": ("PRIMAKLIMA (non-profit offset provider)", I, "", "", ""),
    "Infosys Limited": ("Infosys", C, "", "", ""),
    "Kuehne+Nagel Management AG": ("Kuehne+Nagel", C, "", "", ""),
    "AEL Mining Services Limited, COAS Account: 100015": ("AECI (AEL Mining Services)", C, "", "", "South African carbon tax offset account"),
    "Boston Consulting Group": ("Boston Consulting Group", C, "", "", ""),
    "Fortescue Metals Group Limited": ("Fortescue", C, FMG, "core", ""),
    "WEX Europe Services": ("WEX (fuel card offset programme)", I, "", "", ""),
    "Tokyo Gas Co., Ltd.": ("Tokyo Gas", C, TG, "core", ""),
    "GP-4": ('Unidentified code "GP-4"', U, "", "", ""),
    "Arcadian Organic & Natural Meat Co. Pty Ltd": ("Arcadian Organic & Natural Meat Co.", C, "", "", ""),
    "Nedbank Limited": ("Nedbank Group", C, "", "", ""),
    "Lufthansa Group": ("Lufthansa Group", C, "", "", ""),
    "Recreational Equipment, Inc": ("REI", C, "", "", ""),
    "ZIPAIR Tokyo Inc.": ("Japan Airlines (ZIPAIR)", C, "", "", ""),
    "Zukunftswerk eG": ("Zukunftswerk (offset cooperative)", I, "", "", ""),
    "Qantas Airways Limited": ("Qantas", C, "", "", ""),
    "Lyft": ("Lyft", C, "", "", ""),
    "LifeGate Climate Action per PostePay": ("LifeGate (offset provider, for PostePay)", I, "", "", ""),
    "Logan City Council": ("Logan City Council", P, "", "", ""),
    "Beiersdorf AG": ("Beiersdorf", C, "", "", ""),
    "EnergyAustralia Pty Ltd": ("EnergyAustralia (energy retailer, offsets for customers)", C, "", "", ""),
    "JET2.COM LTD": ("Jet2", C, "", "", ""),
    "Zalando SE": ("Zalando", C, "", "", ""),
    "Kelar SA": ("Kelar SA (Chilean carbon tax compliance)", C, "", "", "compliance offsetting under Chile Law 20.780 art. 8"),
    "Marke Volkswagen": ("Volkswagen AG", C, VW, "partial", "brand"),
    "Woodside Energy Ltd": ("Woodside Energy Group", C, WDS, "core", ""),
    "ENGIE ABN 67 69 241 237": ("ENGIE SA", C, ENG, "core", "ENGIE Australia (ABN as written in registry)"),
    "Nespresso S.A. - carbon offsetting": ("Nestlé (Nespresso)", C, "", "", ""),
    "Yibin Petrochina Kunlun Gas Co., Ltd": ("PetroChina Co Ltd", C, KUN, "core", "Kunlun Energy subsidiary"),
    "Vattenfall Europe Sales GmbH": ("Vattenfall AB", C, VAT, "core", "retail subsidiary"),
    "Groupe Air France": ("Air France-KLM", C, "", "", ""),
    "The Gold Standard Foundation": ("Gold Standard Foundation", I, "", "", ""),
    "GP-004-Clean Advantage-Corpay EU": ("Corpay (fuel card offset programme)", I, "", "", ""),
    "Volkswagen Brand Passenger Cars": ("Volkswagen AG", C, VW, "partial", "brand"),
    "ENGIE Energía Chile S.A": ("ENGIE SA", C, ENG, "core", "subsidiary (Chile)"),
    "Allianz SE": ("Allianz", C, "", "", ""),
    "GrabCar Sdn. Bhd.": ("Grab Holdings", C, "", "", ""),
    "Origin Energy Limited (Under Climate Active)": ("Origin Energy", C, ORG, "core", ""),
    "Stadtwerke Rostock AG": ("Stadtwerke Rostock AG", C, SWR, "core", ""),
    "Carbonfund.org Foundation": ("Carbonfund.org (non-profit offset provider)", I, "", "", ""),
    "Paris 2024 Olympic and Paralympic Organising committee": ("Paris 2024 Organising Committee", P, "", "", ""),
    "Chiesi Limited": ("Chiesi Group", C, "", "", ""),
    "Transaction Reference 11640": ("Unnamed (transaction reference)", A, "", "", "details name the retailer Upside Services Inc."),
    "Barilla/Harry's": ("Barilla Group", C, "", "", ""),
    "Nicoventures Trading Limited": ("British American Tobacco (Nicoventures)", C, "", "", ""),
    "BIOMAX SA": ("Biomax SA", C, "", "", ""),
    "eprimo GmbH": ("E.ON SE", C, EON, "core", "retail subsidiary (eprimo)"),
    "Australia and New Zealand Banking Group Ltd": ("ANZ", C, "", "", ""),
    "Barilla/Mulino Bianco": ("Barilla Group", C, "", "", ""),
    "GRABCAR PTE. LTD.": ("Grab Holdings", C, "", "", ""),
    "Luigi Lavazza Spa": ("Lavazza Group", C, "", "", ""),
    "Jiangsu Contemporary Amperex Technology Co., Limited": ("CATL", C, "", "", ""),
    "Ovako Group": ("Ovako", C, "", "", ""),
    "Groupe La Poste – BSCC COLIS": ("Groupe La Poste", C, "", "", ""),
    "Ovo Energy": ("OVO (energy retailer, offsets for customers)", C, "", "", ""),
    "Delta Air Lies": ("Delta Air Lines Inc", C, DAL, "partial", 'typo in registry ("Lies")'),
    "BrewDog PLC": ("BrewDog", C, "", "", ""),
    "I.F.": ('Unidentified code "I.F."', U, "", "", ""),
    "EYGS": ("EY", C, "", "", ""),
    "Süwag Vertrieb AG & Co. KG": ("Süwag (energy retailer)", C, "", "", ""),
    "Maple Leaf Foods Inc.": ("Maple Leaf Foods", C, "", "", ""),
    "easyJet Airline Company Limited": ("easyJet plc", C, "", "", ""),
    "BEF Customers": ("Bonneville Environmental Foundation (for customers)", I, "", "", ""),
    "Booking Holdings Inc.": ("Booking Holdings", C, "", "", ""),
    "Patch's customers and/ or their End Users": ("Patch (offset marketplace, for customers)", I, "", "", ""),
    "Rémy Cointreau": ("Rémy Cointreau", C, "", "", ""),
    "FRIEDRICH SCHARR KG": ("Friedrich Scharr KG", C, "", "", ""),
    "Gucci": ("Kering (Gucci)", C, "", "", ""),
    "Microsoft": ("Microsoft", C, "", "", ""),
    "Grab Company Limited": ("Grab Holdings", C, "", "", ""),
    "Bonnier Books": ("Bonnier Group", C, "", "", ""),
    "Städtische Werke AG, Königstor 3-13, 34117 Kassel": ("Städtische Werke Kassel (energy retailer)", C, "", "", ""),
    "ENTEGA Plus GmbH NATURbalance Erdgas Absatz Privatkunden Teilmenge Januar-November 2022": ("Entega AG", C, ENT, "core", "retail gas offsetting for private customers"),
    "Traxys Africa Trading Pty Ltd: COAS Entity ID:   119103": ("Traxys (South African carbon tax offset account)", C, "", "", ""),
    "Guangdong Ruiqing Contemporary Amperex Technology Limited": ("CATL", C, "", "", "subsidiary"),
    # Holcim subsidiaries (small, outside the top 160)
    "Holcim Belgique": ("Holcim AG", C, HOL, "core", "subsidiary (Belgium)"),
    "HOLCIM (ROMANIA) SA": ("Holcim AG", C, HOL, "core", "subsidiary (Romania)"),
    "Holcim (Australia) Pty Ltd": ("Holcim (Australia)", C, "", "", "ownership at time of retirement not verified; not linked to Holcim AG"),
    # further ENGIE names outside the top 160
    "ENGIE": ("ENGIE SA", C, ENG, "core", ""),
    "ENGIE Impact": ("ENGIE SA", C, ENG, "core", "subsidiary"),
    "Engie Energía Perú": ("ENGIE SA", C, ENG, "core", "subsidiary (Peru)"),
    "ENGIE South East Asia Pte. Ltd": ("ENGIE SA", C, ENG, "core", "subsidiary"),
}


def main(top=160):
    rows = json.loads((HERE.parent / "web" / "data" / "index.json").read_text(encoding="utf-8"))["rows"]
    names = [r[0] for r in rows]
    targets = names[:top] + [n for n in M if n in set(names[top:])]
    out, missing = [], []
    for n in targets:
        if n.startswith("0x") and len(n) >= 40:
            g = ("Crypto wallet", W, "", "", "on-chain retirement (tokenized credits)")
        elif n in M:
            g = M[n]
        else:
            missing.append(n)
            continue
        out.append({"buyer_name": n, "group": g[0], "type": g[1], "ct_parent_id": g[2], "coverage": g[3], "note": g[4]})
    with open(HERE / "buyers.csv", "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(out[0]))
        w.writeheader()
        w.writerows(out)
    unused = [k for k in M if k not in set(names)]
    print(f"{len(out)} rows written; unclassified in top {top}: {missing}; names not in index: {unused}")


if __name__ == "__main__":
    main()
