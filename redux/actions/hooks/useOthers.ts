import { hideLoginModal, setLoading, showHideToast, showLoginModal } from "@/redux/slices/OtherSlice";
import { RootState } from "@/redux/store";
import { useCallback } from "react";
import { ToastProps } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

export const useLoading = () => {
   const loading = useSelector((state: RootState) => state.other.loading);
   const dispatch = useDispatch();
   const showLoading = useCallback((props: boolean) => {
    dispatch(setLoading(props));
   }, [dispatch]);
   return {
    loading,
    showLoading,
   };
};

export const useToast = () => {
  const toast = useSelector((state: RootState) => state.other.toast);
  const dispatch = useDispatch();
  const Toaster = useCallback(
    (props: ToastProps) => {
      dispatch(showHideToast(props));
    },
    [dispatch]
  );
  return {
    Toaster,
    toast,
  };
};

export const useLoginModal = () => {
  const loginModal = useSelector((state: RootState) => state.other.loginModal);
  const dispatch = useDispatch();
  
  const showModal = useCallback(
    (message?: string) => {
      dispatch(showLoginModal({ message }));
    },
    [dispatch]
  );

  const hideModal = useCallback(() => {
    dispatch(hideLoginModal());
  }, [dispatch]);

  return {
    loginModal,
    showModal,
    hideModal,
  };
};
