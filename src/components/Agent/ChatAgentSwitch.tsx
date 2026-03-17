import { Switch } from "@mui/material";
import { styled } from "@mui/material/styles";

const defaultSuccessColor = "#65C466";

export const ChatAgentSwitch = styled(Switch)(({ theme }) => {
  const success =
    (theme.palette as { success?: { main?: string } }).success?.main ?? defaultSuccessColor;
  const successEncoded = encodeURIComponent(success);
  const trackOff = theme.palette.grey[400] ?? "#aab4be";
  const thumbOff = theme.palette.primary.dark ?? "#001e3c";
  const successDark = (theme.palette as { success?: { dark?: string } }).success?.dark ?? "#2f9101";

  return {
    width: 60,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2220%22%20width%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22${successEncoded}%22%20d%3D%22M20%209V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9%203.34%209%205H6c-1.1%200-2%20.9-2%202v2c-1.66%200-3%201.34-3%203s1.34%203%203%203v4c0%201.1.9%202%202%202h12c1.1%200%202-.9%202-2v-4c1.66%200%203-1.34%203-3s-1.34-3-3-3M7.5%2011.5c0-.83.67-1.5%201.5-1.5s1.5.67%201.5%201.5S9.83%2013%209%2013s-1.5-.67-1.5-1.5M16%2017H8v-2h8zm-1-4c-.83%200-1.5-.67-1.5-1.5S14.17%2010%2015%2010s1.5.67%201.5%201.5S15.83%2013%2015%2013%22%2F%3E%3C%2Fsvg%3E')`
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: success
        }
      }
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: thumbOff,
      width: 28,
      height: 28,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2220%22%20width%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M20%209V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9%203.34%209%205H6c-1.1%200-2%20.9-2%202v2c-1.66%200-3%201.34-3%203s1.34%203%203%203v4c0%201.1.9%202%202%202h12c1.1%200%202-.9%202-2v-4c1.66%200%203-1.34%203-3s-1.34-3-3-3M7.5%2011.5c0-.83.67-1.5%201.5-1.5s1.5.67%201.5%201.5S9.83%2013%209%2013s-1.5-.67-1.5-1.5M16%2017H8v-2h8zm-1-4c-.83%200-1.5-.67-1.5-1.5S14.17%2010%2015%2010s1.5.67%201.5%201.5S15.83%2013%2015%2013%22%2F%3E%3C%2Fsvg%3E')`
      }
    },
    "& .Mui-checked": {
      "& .MuiSwitch-thumb": {
        backgroundColor: "#f9f9f9",
        border: `solid 2px ${successDark}`
      }
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: trackOff,
      borderRadius: 20 / 2
    }
  };
});
