import { generateUrl } from "../urlUtils";

describe("product-url-path tests", () => {
  describe("generateUrl tests", () => {
    describe("When url parts has special characters", () => {
      describe("And one single url part is provided", () => {
        it("removes ALL special characters", () => {
          const result = generateUrl([
            `±!£$%^&*()+~\`¡€#¢∞§¶•–≠«‘“{}\`∑®†¥¨^¬˚∆˙©∂≈√∫~≤≥÷≠`
          ]);
          expect(result).toEqual("");
        });
        it("with special characters and `_` removes ALL special characters as well as all occuranes of spaces '_' with single '-'", () => {
          const result = generateUrl([
            `±!£$%___^&*()+~_\`¡€#¢______∞§¶•–≠«‘“{}\`_____∑®†¥¨^¬˚∆˙©∂≈√∫~≤≥÷≠`
          ]);
          expect(result).toEqual("-");
        });
        it("with special characters and multiple spaces removes ALL special characters as well as all occuranes of spaces with single '-'", () => {
          const result = generateUrl([
            `±!£$%    ^&*()+~_\`¡€#¢    ∞§¶•–≠«‘“{}\`   ∑®†¥¨^¬˚∆˙©∂≈√∫~≤≥÷≠/`
          ]);
          expect(result).toEqual("-");
        });
        it("with special characters, '_' and multiple spaces removes ALL special characters as well as all occuranes of '_' and spaces with single '-'", () => {
          const result = generateUrl([
            `±!£$%    ^&*()+~_\`______¡€#¢    ∞§¶•–≠«___‘“{}\`   ∑®†¥¨^¬˚∆˙©∂______≈√∫~≤≥÷≠/`
          ]);
          expect(result).toEqual("-");
        });
        it("with some text removes ALL special characters", () => {
          const result = generateUrl([
            `Thickness\`: 1~40#mm $Wid!th:1.'5m, Th{ic?kn;"e}s\\s: 200[m]m W<i>d,th:2.5m`
          ]);
          expect(result).toEqual(
            "thickness-140mm-width1-5m-thickness-200mm-wid-th2-5m"
          );
        });
        it("replaces `/` with `-` ", () => {
          const result = generateUrl([
            `Firstanfang/endstein glatt Protector`,
            `Reduzierung NW 100/70`,
            `Glasfaservlies 120g/m²`
          ]);
          expect(result).toEqual(
            "firstanfang-endstein-glatt-protector-reduzierung-nw-100-70-glasfaservlies-120g-m"
          );
        });
        it("replaces repeated occurances of `/` with single `-` ", () => {
          const result = generateUrl([
            `Firstanfang//endstein glatt Protector`,
            `Reduzierung NW 100//70`,
            `Glasfaservlies 120g////m²`
          ]);
          expect(result).toEqual(
            "firstanfang-endstein-glatt-protector-reduzierung-nw-100-70-glasfaservlies-120g-m"
          );
        });
      });

      describe("And multiple url parts are provided", () => {
        it("removes ALL special characters", () => {
          const result = generateUrl([
            `Thickness\`: 1~40#mm $Wid!th:1.'5m, Th{ic?kne}s\\s: 200[m]m W<i>d,th:2.5m`,
            `color\`: teg~lrød# $hEIg!ht:2.+9&0m=, we{ig?ht}\\: 300(k)g W@i>d{th:3}3m-også`
          ]);
          expect(result).toEqual(
            "thickness-140mm-width1-5m-thickness-200mm-wid-th2-5m-color-teglrød-height2-90m-weight-300kg-width33m-også"
          );
        });

        it("with unicode characters removes ALL special characters and unicode characters", () => {
          const result = generateUrl([
            `Thickness\`: 1~40#mm $Widœ∑´®†¥¨^øπ“‘æ…˚∆˙©ƒ∂ßåç≈√∫~µ≤≥÷≠–ª•¶§∞¢#€¡‚·!th:1.'5m, Th{ic?kne}s\\s: 200[m]m W<i>d,th:2.5m£~$@~∑´œ∑´˙˚∆≤~çß¬´ß¬˚ƒ•¶#~¡€˚∆˙˙çß¬∂∆˚çßµ∫~∫∫ß√ç¬…¬å¨^¥∑´˙√ç`,
            `color\`: teg~lrød# $hEIg!ht:2.+9&0m=, we{ig?ht}\\: 300(k)g W@i>d{th:3}3m-også`
          ]);
          expect(result).toEqual(
            "thickness-140mm-widœøπæƒßåçµªth1-5m-thickness-200mm-wid-th2-5mœçßßƒçßçßµßçåç-color-teglrød-height2-90m-weight-300kg-width33m-også"
          );
        });
        it("with DE (German) and unicode characters removes ALL special characters and keeps language specific characters", () => {
          const result = generateUrl([
            `Thickness\`: 1~40#mm $Widœ∑´®†¥¨^øπ“‘æ…˚∆˙©ƒ∂ßåç≈√∫~µ≤≥÷≠–ª•¶§∞¢#€¡‚·!th:1.'5m, Th{ic?kne}s\\s: 200[m]m W<i>d,th:2.5m£~$@~∑´œ∑´˙˚∆≤~çLebensabschnittsgefährte rectequeß¬´ß¬˚ƒ•¶#~¡€˚∆˙˙çß¬∂∆˚çßµ∫~∫∫ß√ç¬…¬å¨^¥∑´˙√ç`,
            `color\`: teg~lrød# $hEIg!ht:2.+9&adhuc laboramus sadipscing per Vorsprung durch Technik in mei ullum gloriatur0m=, we{ig?ht}\\: 300(k)g W@Die Ärztei>d{th:3}3m-også`
          ]);
          expect(result).toEqual(
            "thickness-140mm-widœøπæƒßåçµªth1-5m-thickness-200mm-wid-th2-5mœçlebensabschnittsgefährte-rectequeßßƒçßçßµßçåç-color-teglrød-height2-9adhuc-laboramus-sadipscing-per-vorsprung-durch-technik-in-mei-ullum-gloriatur0m-weight-300kg-wdie-ärzteidth33m-også"
          );
        });
        it("removes ALL occurances of repeated `.` , '_' and `,` and replaces them with single `-`", () => {
          const result = generateUrl([
            "zanda_arktis___normalstein",
            `Thickness: 1.,__40mm Width:1,.5m,, Thick__ness: 20.,.,000,.00nm Width:2.__,5m`,
            `color: teglrød hE_Ight:2..90m, weight: 300(k)g Width:33333,,33..,..,,.33m---også, material=ubehandlet overflate`
          ]);
          expect(result).toEqual(
            "zanda-arktis-normalstein-thickness-1-40mm-width1-5m-thick-ness-20-000-00nm-width2-5m-color-teglrød-he-ight2-90m-weight-300kg-width33333-33-33m-også-materialubehandlet-overflate"
          );
        });
      });
    });
  });
});
