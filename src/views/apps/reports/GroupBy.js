import React, { useState } from "react";

//MATERIAL
import { Grid, InputLabel, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { setGroupByValue } from "src/store/apps/reports";
import PickersRange from "./PeriodPicker";
import { useTheme } from "@emotion/react";

//------------CONSTANTS-----------
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const GroupBy = () => {
  //------------- HOOKS --------------
  const [state, setState] = useState({
    isLoading: false,
  });
  const store = useSelector(state => state.reports);
  const dispatch = useDispatch();

  const groupByItems = ["Client", "Project", "User"];

  const handleChange = async (e) => {
    dispatch(setGroupByValue(e.target.value))
  };
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  //MAIN RENDER
  return (
    <Grid container className="filter-container" sx={{ alignItems: 'center' }}>
      {/* <Grid item className="filter-label">
                <Typography variant="body1" component="p" className="theme-purple">
                    Group by
                </Typography>
            </Grid> */}

      <Grid item className="filter-control">
        <FormControl sx={{ m: 4, width: 300 }}>
          <InputLabel id="demo-select-small-label">Group By</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-simple-select-autowidth"
            label="Group By"
            value={store.groupByValue}
            defaultValue="User"
            onChange={handleChange}
            autoWidth
            style={{ width: "250px" }}
          >
            {groupByItems.map((item) => (
              <MenuItem key={item} value={item} style={{ width: "250px" }}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid sx={{ mb: 4 }}>
        <PickersRange popperPlacement={popperPlacement} />
      </Grid>
    </Grid>
  );
};
