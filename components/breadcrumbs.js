/** @jsx jsx */
import { Component } from "react";
import PropTypes from "prop-types";
import { globalTheme } from "../theme";
import { css, jsx } from "@emotion/core";
import Container from "./container";
import HomeIcon from "./icons/Home";
import HeaderLink from "./header_link";

const greyBanner = css`
  background-color: ${globalTheme.colour.paleGreyishBrown};
  width: 100%;
  padding-bottom: 20px;
  margin-bottom: 30px;
  font-weight: bold;
  color: ${globalTheme.colour.greyishBrown};
  font-size: 16px;
`;

const breadCrumbStyle = css`
  padding-top: 15px;
`;

const separator = css`
  padding: 0 5px;
`;

const urlStyle = css`
  color: #6d6363;
  text-decoration: underline;
  font-size: 16px;
`;

const iconStyle = css`
  vertical-align: bottom;
`;

export class BreadCrumbs extends Component {
  render() {
    const { breadcrumbs, homeUrl } = this.props;
    return (
      <div css={greyBanner}>
        <Container>
          <div css={breadCrumbStyle}>
            <HeaderLink id="homeButton" href={homeUrl} css={urlStyle}>
              <HomeIcon css={iconStyle} /> {this.props.t("titles.home")}
            </HeaderLink>
            {breadcrumbs.map((breadcrumb, i) => (
              <span key={"breadcrumb" + i}>
                <span css={separator}> / </span>
                <HeaderLink
                  id={"breadcrumb" + i}
                  href={breadcrumb.url}
                  css={urlStyle}
                >
                  {breadcrumb.name}
                </HeaderLink>
              </span>
            ))}
            <span css={separator}> / </span>
            <span>{this.props.pageTitle}</span>
          </div>
        </Container>
      </div>
    );
  }
}

BreadCrumbs.propTypes = {
  t: PropTypes.func.isRequired,
  breadcrumbs: PropTypes.array.isRequired,
  pageTitle: PropTypes.string.isRequired,
  homeUrl: PropTypes.string
};

export default BreadCrumbs;
