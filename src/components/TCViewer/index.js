import React, { Component } from "react";
import {
  Box,
  Dialog,
  withStyles,
  Typography,
  IconButton,
  CircularProgress,
  DialogTitle,
  DialogContent
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import GetAppIcon from "@material-ui/icons/GetApp";
import * as FileSaver from "file-saver";
import { fetchTCFile } from "~/redux/helpers/user";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { styles } from "./styles";

class TCViewer extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
    data: null,
    dataType: 0, //0-html, 1-pdf
    dataUrl: null,
    isLoading: true,
  };

  componentDidMount = () => {
    this.fetchFile();
  };

  fetchFile = () => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    const { t } = this.props;

    fetchTCFile(routeParam).then((response) => {
      if (!response) {
        this.setState({
          isLoading: false,
          dataType: 0,
          data: response.data,
          dataUrl: t("pdfViewer.label.noTnC"),
        });
        return false;
      }
      if (response?.data?.htmlContent) {
        this.setState({
          isLoading: false,
          dataType: 0,
          data: response.data,
          dataUrl: response?.data?.htmlContent || "",
        });
      } else {
        const data = new Blob([response.data], {
          type: "application/pdf",
          encoding: "UTF-8",
        });
        //FileSaver.saveAs(data, filename);
        const blob_url = URL.createObjectURL(data);
        this.setState({ dataType: 1, data: response.data, dataUrl: blob_url });
      }
    });
  };

  handleDownload = () => {
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    fetchTCFile(routeParam).then((response) => {
      const filename = "TermsAndConditions.pdf";
      const data = new Blob([response.data], {
        type: "application/pdf",
        encoding: "UTF-8",
      });
      FileSaver.saveAs(data, filename);
    });
  };

  hideLoader = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { classes, handleClose, open = false, t, user } = this.props;
    const { dataType, dataUrl, isLoading } = this.state;
    const popupBGColor = user?.brandInfo?.themeColorAccent ?? null 

    return (
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={open}
        onClose={() => {}}
        onScroll={this.trackScrolling}
      >
        <DialogTitle id="customized-dialog-title" style={{paddingTop: 0, paddingBottom: 0}}>
          <Box display="flex" width="100%" position="relative">
            <Box p={1} pl={3} display="flex" alignItems="center">
              <Typography variant="h3" style={{fontWeight: 'bold'}}>{t("pdfViewer.label.TnC")}</Typography>
            </Box>
            <Box p={1} flexGrow={1}>
              {dataType === 1 ? (
                <IconButton
                  title={t("pdfViewer.label.download")}
                  onClick={() => this.handleDownload()}
                >
                  <GetAppIcon title={t("pdfViewer.label.download")} />
                </IconButton>
              ) : null}
            </Box>
            <Box
              p={1}
              display="flex"
              justifyContent="flex-end"
              className={classes.closeIcon}
            >
              <IconButton onClick={() => handleClose()}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers 
          style={{
            paddingTop: 0, 
            background: Boolean(popupBGColor) ? popupBGColor : "#fff",
            color: Boolean(popupBGColor) ? "#fff" : "#333"
          }}>
          {open ? (
            <Box
              display="flex"
              justifyContent="center"
              width="100%"
              height="600px"
            >
              {/* {window.navigator && window.navigator.msSaveOrOpenBlob ?
                  <object
                      data={file}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                  ></object>:<iframe id="faq" title={t('pdfViewer.label.faq')}
                name={t('pdfViewer.label.faq')}
                src={file}
                width="100%"
                height="100%"
                type="application/pdf"
              ></iframe>
              } */}
              {isLoading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  position="absolute"
                  zIndex={100}
                  style={{
                    tranform: "translate(-50%, -50%)",
                    top: "50%",
                    right: "50%",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : null}
              {dataType === 1 ? (
                <iframe
                  id="termsNCondition"
                  title={t("pdfViewer.label.termsNCondition")}
                  name={t("pdfViewer.label.termsNCondition")}
                  src={dataUrl}
                  onLoad={this.hideLoader}
                  width="100%"
                  height="100%"
                ></iframe>
              ) : null}
              {dataType === 0 ? (
                <Box
                  dangerouslySetInnerHTML={{ __html: dataUrl }}
                  maxWidth={960}
                  style={{ wordBreak: "break-word" }}
                  flexWrap={true}
                  p={2}
                ></Box>
              ) : null}
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    );
  }
}
export default compose(withTranslation("common"), withStyles(styles))(TCViewer);
