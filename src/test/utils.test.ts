import { includesAny, normalize, sanitizeArtifactPath } from "../util";

describe("normalize", () => {
  it("whitespace", () => {
    const word = "  nestle ";
    const normalized = normalize(word);
    expect(normalized).toEqual("nestle");
  });
  it("uppercase", () => {
    const word = " Nestle";
    const normalized = normalize(word);
    expect(normalized).toEqual("nestle");
  });
  it("special character", () => {
    const word = "néstle";
    const normalized = normalize(word);
    expect(normalized).toEqual("nestle");
  });
  it("trademark symbol", () => {
    const word = "néstle®";
    const normalized = normalize(word);
    expect(normalized).toEqual("nestle");
  });
  it("space", () => {
    const word = "néstle Toll House";
    const normalized = normalize(word);
    expect(normalized).toEqual("nestle toll house");
  });
});

describe("includesAny", () => {
  const prefixes = ["nestle", "nan"];
  it("whole word", () => {
    const text = "nestle";
    const hasBrand = includesAny(text, prefixes);
    expect(hasBrand).toEqual("nestle");
  });
  it("whole word (no match)", () => {
    const text = "toffee";
    const hasBrand = includesAny(text, prefixes);
    expect(hasBrand).toEqual(undefined);
  });
  it("starts with", () => {
    const text = "nestle product";
    const hasBrand = includesAny(text, prefixes);
    expect(hasBrand).toEqual("nestle");
  });
  it("starts with (no match)", () => {
    const text = "nestleproduct";
    const hasBrand = includesAny(text, prefixes);
    expect(hasBrand).toEqual(undefined);
  });
  it("within text", () => {
    const text = "delonghi machine nestle whatever";
    const hasBrand = includesAny(text, prefixes);
    expect(hasBrand).toEqual("nestle");
  });
  it("within text (no match)", () => {
    const text = "dole bananas";
    const hasBrand = includesAny(text, prefixes);
    expect(hasBrand).toEqual(undefined);
  });
});

describe("sanitizePath", () => {
  it("works (:)", () => {
    const p = "1:a:3";
    expect(sanitizeArtifactPath(p)).toEqual("1_a_3");
  });
  it("works (<>)", () => {
    const p = "1<a<3>";
    expect(sanitizeArtifactPath(p)).toEqual("1_a_3_");
  });
  it('works (")', () => {
    const p = '1"a:3';
    expect(sanitizeArtifactPath(p)).toEqual("1_a_3");
  });
  it("works (|)", () => {
    const p = "1|a:3";
    expect(sanitizeArtifactPath(p)).toEqual("1_a_3");
  });
  it("works (*)", () => {
    const p = "1*a*3";
    expect(sanitizeArtifactPath(p)).toEqual("1_a_3");
  });
  it("works (?)", () => {
    const p = "1?a:3";
    expect(sanitizeArtifactPath(p)).toEqual("1_a_3");
  });
  it("works (carriage return)", () => {
    const p = "1\ra:3";
    expect(sanitizeArtifactPath(p)).toEqual("1_a_3");
  });
  it("works (newline)", () => {
    const p = "1\na:3";
    expect(sanitizeArtifactPath(p)).toEqual("1_a_3");
  });
});
