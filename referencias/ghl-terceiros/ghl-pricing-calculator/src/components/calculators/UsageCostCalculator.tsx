"use client"

import { useState, useMemo } from 'react'

interface SMSMState {
  smsSegments: number
  mmsMessages: number
  outboundSplit: number
  carrierFeeType: 'att-tmobile' | 'verizon' | 'weighted'
}

interface VoiceState {
  outboundMinutes: number
  inboundMinutes: number
  callRecording: boolean
  transcription: boolean
  voicemailDrops: number
}

interface EmailState {
  emailsPerMonth: number
  verifications: number
  dedicatedIP: boolean
}

interface AIState {
  conversationMessages: number
  voiceMinutes: number
  reviews: number
  contentWords: number
  contentImages: number
  workflowExecutions: number
  useUnlimited: boolean
  subAccounts: number
}

interface WorkflowState {
  executions: number
}

const RATES = {
  sms: {
    perSegment: 0.0083,
    carrierFees: {
      attTmobile: 0.003,
      verizon: 0.005,
      weighted: 0.0038 // Average weighted
    }
  },
  mms: {
    outbound: 0.022,
    inbound: 0.0165,
    carrierFees: {
      attTmobile: 0.003,
      verizon: 0.005,
      weighted: 0.0038
    }
  },
  voice: {
    outbound: 0.0166,
    inbound: 0.01165,
    recording: 0.0025,
    transcription: 0.024,
    voicemailDrop: 0.018
  },
  email: {
    per1000: 0.675,
    verificationPer1000: 2.50,
    dedicatedIP: 59
  },
  ai: {
    conversation: 0.02,
    voice: 0.06,
    review: 0.01,
    contentWords: 0.0945, // per 1000 words
    contentImage: 0.063,
    workflowExecution: 0.01,
    unlimited: 97
  },
  workflow: {
    perExecution: 0.01,
    tiers: {
      starter: { max: 10000, cost: 10 },
      growth: { max: 30000, cost: 25 },
      scale: { max: 65000, cost: 50 }
    }
  }
}

export default function UsageCostCalculator() {
  const [smsState, setSmsState] = useState<SMSMState>({
    smsSegments: 0,
    mmsMessages: 0,
    outboundSplit: 50,
    carrierFeeType: 'weighted'
  })

  const [voiceState, setVoiceState] = useState<VoiceState>({
    outboundMinutes: 0,
    inboundMinutes: 0,
    callRecording: false,
    transcription: false,
    voicemailDrops: 0
  })

  const [emailState, setEmailState] = useState<EmailState>({
    emailsPerMonth: 0,
    verifications: 0,
    dedicatedIP: false
  })

  const [aiState, setAIState] = useState<AIState>({
    conversationMessages: 0,
    voiceMinutes: 0,
    reviews: 0,
    contentWords: 0,
    contentImages: 0,
    workflowExecutions: 0,
    useUnlimited: false,
    subAccounts: 1
  })

  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    executions: 0
  })

  // Calculate SMS/MMS Cost
  const smsCost = useMemo(() => {
    const carrierFeeRate = RATES.sms.carrierFees[
      smsState.carrierFeeType === 'att-tmobile' ? 'attTmobile' :
      smsState.carrierFeeType === 'verizon' ? 'verizon' : 'weighted'
    ]

    const smsCost = smsState.smsSegments * (RATES.sms.perSegment + carrierFeeRate)

    const mmsOutbound = smsState.mmsMessages * (smsState.outboundSplit / 100)
    const mmsInbound = smsState.mmsMessages * (1 - smsState.outboundSplit / 100)

    const mmsOutboundCost = mmsOutbound * (RATES.mms.outbound + carrierFeeRate)
    const mmsInboundCost = mmsInbound * (RATES.mms.inbound + carrierFeeRate)

    return {
      sms: smsCost,
      mmsOutbound: mmsOutboundCost,
      mmsInbound: mmsInboundCost,
      total: smsCost + mmsOutboundCost + mmsInboundCost
    }
  }, [smsState])

  // Calculate Voice Cost
  const voiceCost = useMemo(() => {
    const outboundBase = voiceState.outboundMinutes * RATES.voice.outbound
    const inboundBase = voiceState.inboundMinutes * RATES.voice.inbound

    const totalMinutes = voiceState.outboundMinutes + voiceState.inboundMinutes

    const recordingCost = voiceState.callRecording ? totalMinutes * RATES.voice.recording : 0
    const transcriptionCost = voiceState.transcription ? totalMinutes * RATES.voice.transcription : 0
    const voicemailCost = voiceState.voicemailDrops * RATES.voice.voicemailDrop

    return {
      outbound: outboundBase,
      inbound: inboundBase,
      recording: recordingCost,
      transcription: transcriptionCost,
      voicemail: voicemailCost,
      total: outboundBase + inboundBase + recordingCost + transcriptionCost + voicemailCost
    }
  }, [voiceState])

  // Calculate Email Cost
  const emailCost = useMemo(() => {
    const emailCost = (emailState.emailsPerMonth / 1000) * RATES.email.per1000
    const verificationCost = (emailState.verifications / 1000) * RATES.email.verificationPer1000
    const ipCost = emailState.dedicatedIP ? RATES.email.dedicatedIP : 0

    return {
      emails: emailCost,
      verifications: verificationCost,
      dedicatedIP: ipCost,
      total: emailCost + verificationCost + ipCost
    }
  }, [emailState])

  // Calculate AI Cost
  const aiCost = useMemo(() => {
    if (aiState.useUnlimited) {
      return {
        unlimited: aiState.subAccounts * RATES.ai.unlimited,
        payPerUse: 0,
        total: aiState.subAccounts * RATES.ai.unlimited,
        savings: 0
      }
    }

    const conversationCost = aiState.conversationMessages * RATES.ai.conversation
    const voiceCost = aiState.voiceMinutes * RATES.ai.voice
    const reviewsCost = aiState.reviews * RATES.ai.review
    const contentWordsCost = (aiState.contentWords / 1000) * RATES.ai.contentWords
    const contentImagesCost = aiState.contentImages * RATES.ai.contentImage
    const workflowCost = aiState.workflowExecutions * RATES.ai.workflowExecution

    const payPerUseTotal = conversationCost + voiceCost + reviewsCost + contentWordsCost + contentImagesCost + workflowCost
    const unlimitedTotal = aiState.subAccounts * RATES.ai.unlimited

    return {
      conversation: conversationCost,
      voice: voiceCost,
      reviews: reviewsCost,
      contentWords: contentWordsCost,
      contentImages: contentImagesCost,
      workflow: workflowCost,
      payPerUse: payPerUseTotal,
      unlimited: unlimitedTotal,
      total: payPerUseTotal,
      savings: payPerUseTotal - unlimitedTotal
    }
  }, [aiState])

  // Calculate Premium Workflow Cost
  const workflowCost = useMemo(() => {
    const executions = workflowState.executions
    const payPerUse = executions * RATES.workflow.perExecution

    let recommendedTier: string = 'Pay-per-use'
    let tierCost = payPerUse

    if (executions >= 65000) {
      recommendedTier = 'Scale ($50/month)'
      tierCost = RATES.workflow.tiers.scale.cost
    } else if (executions >= 30000) {
      recommendedTier = 'Growth ($25/month)'
      tierCost = RATES.workflow.tiers.growth.cost
    } else if (executions >= 10000) {
      recommendedTier = 'Starter ($10/month)'
      tierCost = RATES.workflow.tiers.starter.cost
    }

    return {
      payPerUse,
      tierCost,
      recommendedTier,
      savings: payPerUse - tierCost,
      total: Math.min(payPerUse, tierCost)
    }
  }, [workflowState])

  // Total Cost
  const totalCost = useMemo(() => {
    const total = smsCost.total + voiceCost.total + emailCost.total + aiCost.total + workflowCost.total
    return {
      monthly: total,
      perSubAccount: aiState.subAccounts > 0 ? total / aiState.subAccounts : total,
      annual: total * 12
    }
  }, [smsCost, voiceCost, emailCost, aiCost, workflowCost, aiState.subAccounts])

  return (
    <div className="space-y-8">
      {/* SMS/MMS Calculator */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">SMS/MMS Calculator</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMS Segments per Month
            </label>
            <input
              type="number"
              value={smsState.smsSegments}
              onChange={(e) => setSmsState({ ...smsState, smsSegments: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MMS Messages per Month
            </label>
            <input
              type="number"
              value={smsState.mmsMessages}
              onChange={(e) => setSmsState({ ...smsState, mmsMessages: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outbound/Inbound Split: {smsState.outboundSplit}% / {100 - smsState.outboundSplit}%
            </label>
            <input
              type="range"
              value={smsState.outboundSplit}
              onChange={(e) => setSmsState({ ...smsState, outboundSplit: Number(e.target.value) })}
              className="w-full"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carrier Fee Type
            </label>
            <select
              value={smsState.carrierFeeType}
              onChange={(e) => setSmsState({ ...smsState, carrierFeeType: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="weighted">Weighted Average ($0.0038)</option>
              <option value="att-tmobile">AT&T/T-Mobile ($0.003)</option>
              <option value="verizon">Verizon ($0.005)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Cost Breakdown</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>SMS Cost:</span>
              <span className="font-medium">${smsCost.sms.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>MMS Outbound:</span>
              <span className="font-medium">${smsCost.mmsOutbound.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>MMS Inbound:</span>
              <span className="font-medium">${smsCost.mmsInbound.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-blue-200 font-bold">
              <span>Total SMS/MMS:</span>
              <span className="text-blue-600">${smsCost.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Calls Calculator */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Voice Calls Calculator</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outbound Minutes/Month
              </label>
              <input
                type="number"
                value={voiceState.outboundMinutes}
                onChange={(e) => setVoiceState({ ...voiceState, outboundMinutes: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Rate: $0.0166/min</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inbound Minutes/Month
              </label>
              <input
                type="number"
                value={voiceState.inboundMinutes}
                onChange={(e) => setVoiceState({ ...voiceState, inboundMinutes: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Rate: $0.01165/min</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold text-gray-900">Add-ons</h3>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceState.callRecording}
                onChange={(e) => setVoiceState({ ...voiceState, callRecording: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Call Recording (+$0.0025/min)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceState.transcription}
                onChange={(e) => setVoiceState({ ...voiceState, transcription: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Transcription (+$0.024/min)</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voicemail Drops per Month
              </label>
              <input
                type="number"
                value={voiceState.voicemailDrops}
                onChange={(e) => setVoiceState({ ...voiceState, voicemailDrops: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Rate: $0.018/min</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Cost Breakdown</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Outbound Calls:</span>
              <span className="font-medium">${voiceCost.outbound.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Inbound Calls:</span>
              <span className="font-medium">${voiceCost.inbound.toFixed(2)}</span>
            </div>
            {voiceState.callRecording && (
              <div className="flex justify-between">
                <span>Call Recording:</span>
                <span className="font-medium">${voiceCost.recording.toFixed(2)}</span>
              </div>
            )}
            {voiceState.transcription && (
              <div className="flex justify-between">
                <span>Transcription:</span>
                <span className="font-medium">${voiceCost.transcription.toFixed(2)}</span>
              </div>
            )}
            {voiceState.voicemailDrops > 0 && (
              <div className="flex justify-between">
                <span>Voicemail Drops:</span>
                <span className="font-medium">${voiceCost.voicemail.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-green-200 font-bold">
              <span>Total Voice:</span>
              <span className="text-green-600">${voiceCost.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Calculator */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Calculator</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emails per Month
            </label>
            <input
              type="number"
              value={emailState.emailsPerMonth}
              onChange={(e) => setEmailState({ ...emailState, emailsPerMonth: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Rate: $0.675 per 1,000 emails</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Verifications Needed
            </label>
            <input
              type="number"
              value={emailState.verifications}
              onChange={(e) => setEmailState({ ...emailState, verifications: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Rate: $2.50 per 1,000 verifications</p>
          </div>

          <div className="pt-4 border-t">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailState.dedicatedIP}
                onChange={(e) => setEmailState({ ...emailState, dedicatedIP: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Dedicated IP</span>
                <span className="text-sm text-gray-500 block">$59/month (Pro plan only)</span>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Cost Breakdown</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Email Sending:</span>
              <span className="font-medium">${emailCost.emails.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Email Verifications:</span>
              <span className="font-medium">${emailCost.verifications.toFixed(2)}</span>
            </div>
            {emailState.dedicatedIP && (
              <div className="flex justify-between">
                <span>Dedicated IP:</span>
                <span className="font-medium">${emailCost.dedicatedIP.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-purple-200 font-bold">
              <span>Total Email:</span>
              <span className="text-purple-600">${emailCost.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Services Calculator */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Services Calculator</h2>

        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={aiState.useUnlimited}
              onChange={(e) => setAIState({ ...aiState, useUnlimited: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Use Unlimited AI Plan</span>
              <span className="text-sm text-gray-600 block">$97/month per sub-account</span>
            </div>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Sub-Accounts
            </label>
            <input
              type="number"
              value={aiState.subAccounts}
              onChange={(e) => setAIState({ ...aiState, subAccounts: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>

          {!aiState.useUnlimited && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conversation AI Messages/Month
                  </label>
                  <input
                    type="number"
                    value={aiState.conversationMessages}
                    onChange={(e) => setAIState({ ...aiState, conversationMessages: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">$0.02 per message</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice AI Minutes/Month
                  </label>
                  <input
                    type="number"
                    value={aiState.voiceMinutes}
                    onChange={(e) => setAIState({ ...aiState, voiceMinutes: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">$0.06 per minute</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reviews AI Reviews/Month
                  </label>
                  <input
                    type="number"
                    value={aiState.reviews}
                    onChange={(e) => setAIState({ ...aiState, reviews: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">$0.01 per review</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content AI Words/Month
                  </label>
                  <input
                    type="number"
                    value={aiState.contentWords}
                    onChange={(e) => setAIState({ ...aiState, contentWords: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">$0.0945 per 1,000 words</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content AI Images/Month
                  </label>
                  <input
                    type="number"
                    value={aiState.contentImages}
                    onChange={(e) => setAIState({ ...aiState, contentImages: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">$0.063 per image</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workflow AI Executions/Month
                  </label>
                  <input
                    type="number"
                    value={aiState.workflowExecutions}
                    onChange={(e) => setAIState({ ...aiState, workflowExecutions: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">$0.01 per execution</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Cost Breakdown</h3>
          {aiState.useUnlimited ? (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Unlimited AI ({aiState.subAccounts} sub-account{aiState.subAccounts > 1 ? 's' : ''}):</span>
                <span className="font-medium">${aiCost.unlimited.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-indigo-200 font-bold">
                <span>Total AI:</span>
                <span className="text-indigo-600">${aiCost.total.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Conversation AI:</span>
                <span className="font-medium">${aiCost.conversation?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Voice AI:</span>
                <span className="font-medium">${aiCost.voice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Reviews AI:</span>
                <span className="font-medium">${aiCost.reviews?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Content AI (Words):</span>
                <span className="font-medium">${aiCost.contentWords?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Content AI (Images):</span>
                <span className="font-medium">${aiCost.contentImages?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Workflow AI:</span>
                <span className="font-medium">${aiCost.workflow?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-indigo-200 font-bold">
                <span>Total AI (Pay-per-use):</span>
                <span className="text-indigo-600">${aiCost.payPerUse.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2 pt-2 border-t border-indigo-100">
                <span>Unlimited AI would cost:</span>
                <span>${aiCost.unlimited.toFixed(2)}</span>
              </div>
              {aiCost.savings > 0 ? (
                <div className="flex justify-between text-xs font-medium text-green-600">
                  <span>You're saving with pay-per-use:</span>
                  <span>${aiCost.savings.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-xs font-medium text-orange-600">
                  <span>Unlimited would save you:</span>
                  <span>${Math.abs(aiCost.savings).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Premium Workflows Calculator */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Premium Workflows</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Executions per Month
            </label>
            <input
              type="number"
              value={workflowState.executions}
              onChange={(e) => setWorkflowState({ executions: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Rate: $0.01 per execution</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-teal-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Tier Recommendation</h3>

          <div className="space-y-2 mb-4">
            <div className={`p-3 rounded ${workflowState.executions < 10000 ? 'bg-teal-100 border-2 border-teal-500' : 'bg-white border border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-sm">Pay-per-use</span>
                  <span className="text-xs text-gray-600 block">&lt; 10,000 executions</span>
                </div>
                <span className="text-sm font-bold">${(Math.min(workflowState.executions, 10000) * 0.01).toFixed(2)}</span>
              </div>
            </div>

            <div className={`p-3 rounded ${workflowState.executions >= 10000 && workflowState.executions < 30000 ? 'bg-teal-100 border-2 border-teal-500' : 'bg-white border border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-sm">Starter</span>
                  <span className="text-xs text-gray-600 block">10,000 - 30,000 executions</span>
                </div>
                <span className="text-sm font-bold">$10/month</span>
              </div>
            </div>

            <div className={`p-3 rounded ${workflowState.executions >= 30000 && workflowState.executions < 65000 ? 'bg-teal-100 border-2 border-teal-500' : 'bg-white border border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-sm">Growth</span>
                  <span className="text-xs text-gray-600 block">30,000 - 65,000 executions</span>
                </div>
                <span className="text-sm font-bold">$25/month</span>
              </div>
            </div>

            <div className={`p-3 rounded ${workflowState.executions >= 65000 ? 'bg-teal-100 border-2 border-teal-500' : 'bg-white border border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-sm">Scale</span>
                  <span className="text-xs text-gray-600 block">65,000+ executions</span>
                </div>
                <span className="text-sm font-bold">$50/month</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-teal-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Recommended:</span>
              <span className="text-teal-600 font-bold">{workflowCost.recommendedTier}</span>
            </div>
            {workflowCost.savings > 0 && (
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-green-600">Savings vs pay-per-use:</span>
                <span className="text-green-600 font-bold">${workflowCost.savings.toFixed(2)}/month</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total Summary Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-6">Usage Cost Summary</h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center pb-3 border-b border-blue-400">
            <span className="text-lg">SMS/MMS Services</span>
            <span className="text-xl font-bold">${smsCost.total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-blue-400">
            <span className="text-lg">Voice Services</span>
            <span className="text-xl font-bold">${voiceCost.total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-blue-400">
            <span className="text-lg">Email Services</span>
            <span className="text-xl font-bold">${emailCost.total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-blue-400">
            <span className="text-lg">AI Services</span>
            <span className="text-xl font-bold">${aiCost.total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-blue-400">
            <span className="text-lg">Premium Workflows</span>
            <span className="text-xl font-bold">${workflowCost.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">Total Monthly Cost</span>
            <span className="text-3xl font-bold">${totalCost.monthly.toFixed(2)}</span>
          </div>

          {aiState.subAccounts > 1 && (
            <div className="flex justify-between items-center text-blue-100">
              <span className="text-lg">Cost per Sub-Account</span>
              <span className="text-xl font-semibold">${totalCost.perSubAccount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-blue-100 pt-3 border-t border-blue-400">
            <span className="text-lg">Annual Projection</span>
            <span className="text-xl font-semibold">${totalCost.annual.toFixed(2)}</span>
          </div>
        </div>

        {/* Cost Optimization Tips */}
        <div className="mt-6 bg-white/10 backdrop-blur rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">💡 Cost Optimization Tips</h3>
          <ul className="space-y-2 text-sm text-blue-50">
            {!aiState.useUnlimited && aiCost.savings < 0 && (
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Consider switching to Unlimited AI plan to save ${Math.abs(aiCost.savings).toFixed(2)}/month</span>
              </li>
            )}
            {workflowCost.savings > 0 && (
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Using {workflowCost.recommendedTier} saves you ${workflowCost.savings.toFixed(2)}/month on workflows</span>
              </li>
            )}
            {smsState.smsSegments > 10000 && (
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>High SMS volume detected - consider negotiating bulk rates with support</span>
              </li>
            )}
            {voiceState.transcription && voiceState.outboundMinutes + voiceState.inboundMinutes > 5000 && (
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Transcription adds significant cost at high volumes - evaluate if needed for all calls</span>
              </li>
            )}
            {emailState.dedicatedIP && emailState.emailsPerMonth < 100000 && (
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Dedicated IP may not be necessary for your email volume - consider if worth the cost</span>
              </li>
            )}
            {totalCost.monthly > 1000 && (
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>High usage detected - contact GHL for potential enterprise pricing</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
