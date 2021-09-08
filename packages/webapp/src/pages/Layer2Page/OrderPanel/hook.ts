import React from 'react'
import { TradeStatus, TradeTypes } from '@loopring-web/common-resources'
import { OrderHistoryRawDataItem, OrderHistoryTableDetailItem } from '@loopring-web/component-lib'
import { useAccount } from 'stores/account';
import { LoopringAPI } from 'api_wrapper'
import { volumeToCount } from 'hooks/help'
import { GetOrdersRequest, Side } from 'loopring-sdk'
import store from 'stores'

export const useOrderList = () => {
    const [orderOriginalData, setOrderOriginalData] = React.useState<OrderHistoryRawDataItem[]>([])
    const [orderDetailList, setOrderDetailList] = React.useState<OrderHistoryTableDetailItem[]>([])
    const [totalNum, setTotalNum] = React.useState(0)
    const [showLoading, setShowLoading] = React.useState(false)
    const [showDetailLoading, setShowDetailLoading] = React.useState(false)
    const {account: {accountId, apiKey}} = useAccount()
    const {tokenMap: {marketArray}} = store.getState()
    const {ammMap: {ammMap}} = store.getState().amm

    const ammPairList = ammMap
        ? Object.keys(ammMap)
        : []
    const jointPairs = (marketArray || []).concat(ammPairList)

    const getOrderList = React.useCallback(async (props: Omit<GetOrdersRequest, 'accountId'>) => {
        if (LoopringAPI && LoopringAPI.userAPI && accountId && apiKey) {
            setShowLoading(true)
            const userOrders = await LoopringAPI.userAPI.getOrders({
                ...props,
                accountId,
            }, apiKey)
            if (userOrders && Array.isArray(userOrders.orders)) {
                setTotalNum(userOrders.totalNum)
                setOrderOriginalData(userOrders.orders.map(o => {
                    const {baseAmount, quoteAmount, baseFilled, quoteFilled} = o.volumes

                    const marketList = o.market.split('-')
                    if (marketList.length === 3) {
                        marketList.shift()
                    }
                    // due to AMM case, we cannot use first index
                    const side = o.side === Side.Buy ? TradeTypes.Buy : TradeTypes.Sell
                    const isBuy = side === TradeTypes.Buy
                    // const tokenFirst = marketList[marketList.length - 2]
                    // const tokenLast = marketList[marketList.length - 1]
                    const [tokenFirst, tokenLast] = marketList
                    const baseToken = isBuy ? tokenLast : tokenFirst
                    const quoteToken = isBuy ? tokenFirst : tokenLast
                    const baseValue = isBuy ? volumeToCount(baseToken, quoteAmount) : volumeToCount(baseToken, baseAmount)
                    const quoteValue = isBuy ? volumeToCount(quoteToken, baseAmount) : (volumeToCount(baseToken, baseAmount) || 0) * Number(o.price || 0)

                    return ({
                        market: o.market,
                        side: o.side === 'BUY' ? TradeTypes.Buy : TradeTypes.Sell,
                        orderType: o.orderType,
                        amount: {
                            from: {
                                key: baseToken,
                                value: baseValue?.toFixed(2) as any
                            },
                            to: {
                                key: quoteToken,
                                value: quoteValue?.toFixed(2) as any
                            }
                        },
                        // average: Number(o.price),
                        average: Number(volumeToCount(quoteToken, quoteFilled)) / Number(volumeToCount(baseToken, baseFilled)),
                        // filledAmount: {
                        //     from: {
                        //         key: baseToken,
                        //         // value: Number(baseFilled)
                        //         value: Number(volumeToCount(baseToken, baseFilled))
                        //     },
                        //     to: {
                        //         key: quoteToken,
                        //         value: Number(volumeToCount(quoteToken, quoteFilled))
                        //     }
                        // },
                        price: {
                            key: quoteToken,
                            value: Number(o.price)
                        },
                        time: o.validity.start * 1000,
                        status: o.status as unknown as TradeStatus,
                        hash: o.hash
                    })
                }))
            }
            setShowLoading(false)
        }
    }, [accountId, apiKey])

    const getOrderDetail = React.useCallback(async (orderHash: string) => {
        if (LoopringAPI && LoopringAPI.userAPI && accountId && apiKey) {
            setShowDetailLoading(true)
            const orderDetail = await LoopringAPI.userAPI.getOrderDetails({
                accountId,
                orderHash,
            }, apiKey)
            const formattedData = [orderDetail.orderDetail].map(o => {
                const {baseAmount, quoteAmount, baseFilled, quoteFilled, fee} = o.volumes
                const marketList = o.market.split('-')
                if (marketList.length === 3) {
                    marketList.shift()
                }
                // due to AMM case, we cannot use first index
                const side = o.side === Side.Buy ? TradeTypes.Buy : TradeTypes.Sell
                const isBuy = side === TradeTypes.Buy
                const [tokenFirst, tokenLast] = marketList
                const baseToken = isBuy ? tokenLast : tokenFirst
                const quoteToken = isBuy ? tokenFirst : tokenLast
                const baseValue = isBuy ? volumeToCount(baseToken, quoteAmount) : volumeToCount(baseToken, baseAmount)
                const quoteValue = isBuy ? volumeToCount(quoteToken, baseAmount) : (volumeToCount(baseToken, baseAmount) || 0) * Number(o.price || 0)
                return ({
                    amount: {
                        from: {
                            key: baseToken,
                            value: baseValue?.toFixed(2) as any
                        },
                        to: {
                            key: quoteToken,
                            value: quoteValue?.toFixed(2) as any
                        }
                    },
                    filledPrice: o.price,
                    fee: {
                        key: quoteToken,
                        value: fee,
                    },
                    role: o.side,
                    time: o.validity.start * 1000,
                })
            })
            setOrderDetailList(formattedData)
            setShowDetailLoading(false)
        }
    }, [accountId, apiKey])

    return {
        marketArray: jointPairs,
        getOrderList,
        rawData: orderOriginalData,
        totalNum,
        showLoading,
        showDetailLoading,
        getOrderDetail,
        orderDetailList,
    }
}

