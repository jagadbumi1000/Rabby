import { ReactComponent as RcIconSwapHistory } from '@/ui/assets/swap/history.svg';

import { PageHeader } from '@/ui/component';
import React, { useCallback, useState } from 'react';
import {
  usePollSwapPendingNumber,
  useRabbyFee,
  useSetRabbyFee,
} from '../hooks';
import { SwapTxHistory } from './History';
import { useTranslation } from 'react-i18next';
import { useRabbyDispatch } from '@/ui/store';
import { PendingTx } from '../../Bridge/Component/PendingTx';
import { RabbyFeePopup } from './RabbyFeePopup';
import { useHistory } from 'react-router-dom';
import { getUiType, openInternalPageInTab } from '@/ui/utils';
import { ReactComponent as RcIconFullscreen } from '@/ui/assets/fullscreen-cc.svg';
const isTab = getUiType().isTab;

export const Header = ({ onOpenInTab }: { onOpenInTab?(): void }) => {
  const [historyVisible, setHistoryVisible] = useState(false);
  const { t } = useTranslation();

  const loadingNumber = usePollSwapPendingNumber(5000);

  const { visible, feeDexDesc, dexName } = useRabbyFee();
  const setRabbyFeeVisible = useSetRabbyFee();

  const openHistory = useCallback(() => {
    setHistoryVisible(true);
  }, []);
  const history = useHistory();

  const gotoDashboard = () => {
    history.push('/dashboard');
  };

  const dispath = useRabbyDispatch();

  React.useEffect(() => {
    dispath.swap.getSwapSupportedDEXList();
  }, []);

  return (
    <>
      <PageHeader
        className="mx-[20px] pt-[20px] mb-[14px]"
        forceShowBack={!isTab}
        onBack={gotoDashboard}
        canBack={!isTab}
        rightSlot={
          <div className="flex items-center gap-20 absolute bottom-0 right-0">
            {isTab ? null : (
              <div
                className="text-r-neutral-title1 cursor-pointer"
                onClick={() => {
                  onOpenInTab?.();
                }}
              >
                <RcIconFullscreen />
              </div>
            )}
            {loadingNumber ? (
              <PendingTx number={loadingNumber} onClick={openHistory} />
            ) : (
              <RcIconSwapHistory
                className="cursor-pointer"
                onClick={openHistory}
              />
            )}
          </div>
        }
      >
        {t('page.swap.title')}
      </PageHeader>
      <SwapTxHistory
        visible={historyVisible}
        onClose={useCallback(() => {
          setHistoryVisible(false);
        }, [])}
        getContainer={isTab ? '.js-rabby-popup-container' : undefined}
      />
      <RabbyFeePopup
        visible={visible}
        dexName={dexName}
        feeDexDesc={feeDexDesc}
        onClose={() => setRabbyFeeVisible({ visible: false })}
        getContainer={isTab ? '.js-rabby-popup-container' : undefined}
      />
    </>
  );
};
