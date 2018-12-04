import { mount, shallow } from "enzyme";
import React from "react";
import Router from "next/router";
import questionsFixture from "../fixtures/questions";
import { GuidedExperience } from "../../components/guided_experience";
const { axe, toHaveNoViolations } = require("jest-axe");
import multipleChoiceOptions from "../fixtures/multiple_choice_options";
import translate from "../fixtures/translate";

expect.extend(toHaveNoViolations);

jest.mock("react-ga");

describe("GuidedExperience", () => {
  Router.push = jest.fn();
  let props;
  let _mountedGuidedExperience;
  let _shallowGuidedExperience;

  const mounted_GuidedExperience = () => {
    if (!_mountedGuidedExperience) {
      _mountedGuidedExperience = mount(<GuidedExperience {...props} />);
    }
    return _mountedGuidedExperience;
  };

  const shallow_GuidedExperience = () => {
    if (!_shallowGuidedExperience) {
      _shallowGuidedExperience = shallow(<GuidedExperience {...props} />);
    }
    return _shallowGuidedExperience;
  };

  beforeEach(() => {
    props = {
      t: translate,
      setSection: jest.fn(),
      id: "YY",
      nextSection: "ZZ",
      prevSection: "XX",
      stepNumber: 1,
      children: <div className="thing" />,
      subtitle: "subtitle",
      url: {
        query: { lng: "en", patronType: "p1", serviceType: "s1" },
        route: "/summary"
      },
      reduxState: {
        patronType: "p1",
        serviceType: "s1",
        statusAndVitals: "",
        serviceHealthIssue: "",
        selectedNeeds: {},
        questions: questionsFixture,
        multipleChoiceOptions: multipleChoiceOptions
      }
    };
    _shallowGuidedExperience = undefined;
    _mountedGuidedExperience = undefined;
  });

  it("passes axe tests", async () => {
    let html = mounted_GuidedExperience().html();
    expect(await axe(html)).toHaveNoViolations();
  });

  it("calls setSection if the Next button is pressed", () => {
    mounted_GuidedExperience()
      .find("Button")
      .last()
      .simulate("click");
    expect(props.setSection).toBeCalledWith("ZZ");
  });

  it("calls setSection if the Back button is pressed", () => {
    mounted_GuidedExperience()
      .find("#prevButton")
      .first()
      .simulate("click");
    expect(props.setSection).toBeCalledWith("XX");
  });

  it("renders children", () => {
    expect(shallow_GuidedExperience().find(".thing").length).toEqual(1);
  });

  it("the Next button does not contain an href if nextSection != benefits-directory", () => {
    props.nextSection = "serviceType";
    expect(
      mounted_GuidedExperience()
        .find("Button")
        .last()
        .props().href
    ).toEqual(undefined);
  });

  it("the Next button contains an appropriate href if nextSection == summary", () => {
    props.nextSection = "summary";
    mounted_GuidedExperience()
      .find("Button")
      .last()
      .simulate("click");
    expect(Router.push).toBeCalledWith(
      "/summary?lng=en&patronType=p1&serviceType=s1"
    );
  });

  it("the Next buttons says 'Next'", () => {
    expect(
      mounted_GuidedExperience()
        .find("Button")
        .last()
        .text()
    ).toContain("next");
  });

  it("displays helper text if it exists", () => {
    props.helperText = "helperText";
    expect(
      mounted_GuidedExperience()
        .find("Body")
        .text()
    ).toContain("helperText");
  });

  it("does not display helper text if it does not exist", () => {
    props.helperText = "";
    expect(mounted_GuidedExperience().find("Body").length).toEqual(0);
  });

  it("Intro text appears on step 1 of guided experience", () => {
    props.stepNumber = 0;
    expect(mounted_GuidedExperience().text()).toContain("ge.intro_text_p1");
    expect(mounted_GuidedExperience().text()).toContain("ge.intro_text_p2");
  });

  it("Intro text appears does not appear on steps after step 1 of guided experience", () => {
    props.stepNumber = 1;
    expect(mounted_GuidedExperience().text()).not.toContain("ge.intro_text_p1");
    expect(mounted_GuidedExperience().text()).not.toContain("ge.intro_text_p2");
  });
});
