import React from 'react';
import { withStyles } from '@material-ui/styles';
import { styles } from './styles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { withTranslation } from 'react-i18next';
import ArrowDownIcon from '~/assets/icons/keyboard_arrow_down.svg';

const slList = [
  {
    code: 'en',
    description: 'English',
    id: 1,
    isDefault: 1,
  },
  {
    code: 'fr',
    description: 'French',
    id: 2,
    isDefault: 0,
  },
];
const LocalTranslations = (props) => {
  const { classes } = props;
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);
  const [langAnchorEl, setLangAnchorEl] = React.useState(null);

  const handleLangToggle = (event) => {
    setLangMenuOpen(!langMenuOpen);
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangMenuOpen(false);
    setLangAnchorEl(null);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setLangMenuOpen(false);
    }
  };

  return (
    <>
      <Button
        className={classes.langTranslateButton}
        style={{ padding: '0px' }}
        ref={langAnchorEl}
        aria-controls={langMenuOpen ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        variant="text"
        onClick={handleLangToggle}
      >
        {'English'}
        <img src={ArrowDownIcon} alt="ArrowDownIcon" className={classes.arrowDownIcon} />
      </Button>

      <Popper
        open={langMenuOpen}
        anchorEl={langAnchorEl}
        role={undefined}
        transition
        disablePortal
        style={{zIndex:'1'}}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleLangClose}>
                <MenuList
                  autoFocusItem={langMenuOpen}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  {slList &&
                    slList.map((lang, index) => (
                      <MenuItem
                        value={lang.code}
                      >
                        {`${lang.description} (${lang.code.toUpperCase()})`}
                      </MenuItem>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default withTranslation()(withStyles(styles)(LocalTranslations));
