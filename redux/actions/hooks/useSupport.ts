import { AppDispatch } from "@/redux/store";
import { useCallback } from "react";
import { ToastPresets } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { SupportActions } from "../SupportActions";
import { useToast } from "./useOthers";

export const useGetFAQs = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      order?: "ASC" | "DESC";
    }) => {
      try {
        const result = await dispatch(SupportActions.getFAQs(params || {}));
        return SupportActions.getFAQs.fulfilled.match(result);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useGetMyTickets = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(async () => {
    try {
      const result = await dispatch(SupportActions.getMyTickets());
      return SupportActions.getMyTickets.fulfilled.match(result);
    } catch (error) {
      console.error("Error fetching my tickets:", error);
      return false;
    }
  }, [dispatch]);
};

export const useCreateTicket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();
  return useCallback(
    async (data: {
      type: "BUG" | "FEEDBACK" | "CONTACT";
      subject: string;
      message: string;
      attachmentUrls?: string[];
    }) => {
      try {
        const result = await dispatch(SupportActions.createTicket(data));
        if (SupportActions.createTicket.fulfilled.match(result)) {
          Toaster({
            visible: true,
            message: "Ticket created successfully",
            preset: ToastPresets.SUCCESS,
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error creating ticket:", error);
        return false;
      }
    },
    [dispatch, Toaster]
  );
};
