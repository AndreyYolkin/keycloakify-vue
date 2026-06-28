<script setup lang="ts">
import { clsx } from 'keycloakify/tools/clsx';
import type { KcContext } from 'keycloakify/account/KcContext';
import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
import { kcSanitize } from 'keycloakify/lib/kcSanitize';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'totp.ftl' }>, I18n>>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const { totp, mode, url, messagesPerField, stateChecker } = props.kcContext;
const { msg, msgStr, advancedMsg } = props.i18n;
</script>

<template>
  <component
    :is="Template"
    :kcContext="props.kcContext"
    :i18n="props.i18n"
    :doUseDefaultCss="props.doUseDefaultCss"
    :classes="props.classes"
    active="totp"
  >
    <div class="row">
      <div class="col-md-10">
        <h2><component :is="msg('authenticatorTitle')" /></h2>
      </div>
      <div
        v-if="totp.otpCredentials.length === 0"
        class="subtitle col-md-2"
      >
        <span class="required">*</span>
        <component :is="msg('requiredFields')" />
      </div>
    </div>

    <!-- Enabled: list existing OTP credentials -->
    <template v-if="totp.enabled">
      <table class="table table-bordered table-striped">
        <thead>
          <tr v-if="totp.otpCredentials.length > 1">
            <th :colSpan="4"><component :is="msg('configureAuthenticators')" /></th>
          </tr>
          <tr v-else>
            <th :colSpan="3"><component :is="msg('configureAuthenticators')" /></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(credential, index) in totp.otpCredentials"
            :key="index"
          >
            <td class="provider"><component :is="msg('mobile')" /></td>
            <td
              v-if="totp.otpCredentials.length > 1"
              class="provider"
            >
              {{ credential.id }}
            </td>
            <td class="provider">{{ credential.userLabel || '' }}</td>
            <td class="action">
              <form
                :action="url.totpUrl"
                method="post"
                class="form-inline"
              >
                <input
                  type="hidden"
                  id="stateChecker"
                  name="stateChecker"
                  :value="stateChecker"
                />
                <input
                  type="hidden"
                  id="submitAction"
                  name="submitAction"
                  value="Delete"
                />
                <input
                  type="hidden"
                  id="credentialId"
                  name="credentialId"
                  :value="credential.id"
                />
                <button
                  :id="`remove-mobile-${index}`"
                  class="btn btn-default"
                >
                  <i class="pficon pficon-delete"></i>
                </button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- Not enabled: setup wizard -->
    <template v-else>
      <div>
        <hr />
        <ol id="kc-totp-settings">
          <li>
            <p><component :is="msg('totpStep1')" /></p>
            <ul id="kc-totp-supported-apps">
              <li
                v-for="app in totp.supportedApplications"
                :key="app"
              >
                <component :is="advancedMsg(app)" />
              </li>
            </ul>
          </li>

          <!-- Manual mode -->
          <template v-if="mode === 'manual'">
            <li>
              <p><component :is="msg('totpManualStep2')" /></p>
              <p>
                <span id="kc-totp-secret-key">{{ totp.totpSecretEncoded }}</span>
              </p>
              <p>
                <a
                  :href="totp.qrUrl"
                  id="mode-barcode"
                >
                  <component :is="msg('totpScanBarcode')" />
                </a>
              </p>
            </li>
            <li>
              <p><component :is="msg('totpManualStep3')" /></p>
              <ul>
                <li id="kc-totp-type">
                  <component :is="msg('totpType')" />: <component :is="msg(`totp.${totp.policy.type}`)" />
                </li>
                <li id="kc-totp-algorithm">
                  <component :is="msg('totpAlgorithm')" />: {{ totp.policy.getAlgorithmKey() }}
                </li>
                <li id="kc-totp-digits"><component :is="msg('totpDigits')" />: {{ totp.policy.digits }}</li>
                <li
                  v-if="totp.policy.type === 'totp'"
                  id="kc-totp-period"
                >
                  <component :is="msg('totpInterval')" />: {{ totp.policy.period }}
                </li>
                <li
                  v-else
                  id="kc-totp-counter"
                >
                  <component :is="msg('totpCounter')" />: {{ totp.policy.initialCounter }}
                </li>
              </ul>
            </li>
          </template>

          <!-- QR mode (default) -->
          <template v-else>
            <li>
              <p><component :is="msg('totpStep2')" /></p>
              <p>
                <img
                  id="kc-totp-secret-qr-code"
                  :src="`data:image/png;base64, ${totp.totpSecretQrCode}`"
                  alt="Figure: Barcode"
                />
              </p>
              <p>
                <a
                  :href="totp.manualUrl"
                  id="mode-manual"
                >
                  <component :is="msg('totpUnableToScan')" />
                </a>
              </p>
            </li>
          </template>

          <li>
            <p><component :is="msg('totpStep3')" /></p>
            <p><component :is="msg('totpStep3DeviceName')" /></p>
          </li>
        </ol>
        <hr />

        <!-- Enrollment form -->
        <form
          :action="url.totpUrl"
          :class="kcClsx('kcFormClass')"
          id="kc-totp-settings-form"
          method="post"
        >
          <input
            type="hidden"
            id="stateChecker"
            name="stateChecker"
            :value="stateChecker"
          />

          <!-- OTP code field -->
          <div :class="kcClsx('kcFormGroupClass')">
            <div class="col-sm-2 col-md-2">
              <label
                for="totp"
                class="control-label"
              >
                <component :is="msg('authenticatorCode')" />
              </label>
              <span class="required">*</span>
            </div>
            <div class="col-sm-10 col-md-10">
              <input
                type="text"
                id="totp"
                name="totp"
                autocomplete="off"
                :class="kcClsx('kcInputClass')"
                :aria-invalid="messagesPerField.existsError('totp')"
              />
              <span
                v-if="messagesPerField.existsError('totp')"
                id="input-error-otp-code"
                :class="kcClsx('kcInputErrorMessageClass')"
                aria-live="polite"
                v-html="kcSanitize(messagesPerField.get('totp'))"
              />
            </div>
            <input
              type="hidden"
              id="totpSecret"
              name="totpSecret"
              :value="totp.totpSecret"
            />
            <input
              v-if="mode"
              type="hidden"
              id="mode"
              :value="mode"
            />
          </div>

          <!-- Device name field -->
          <div :class="kcClsx('kcFormGroupClass')">
            <div class="col-sm-2 col-md-2">
              <label
                for="userLabel"
                :class="kcClsx('kcLabelClass')"
              >
                <component :is="msg('totpDeviceName')" />
              </label>
              <span
                v-if="totp.otpCredentials.length >= 1"
                class="required"
                >*</span
              >
            </div>
            <div class="col-sm-10 col-md-10">
              <input
                type="text"
                id="userLabel"
                name="userLabel"
                autocomplete="off"
                :class="kcClsx('kcInputClass')"
                :aria-invalid="messagesPerField.existsError('userLabel')"
              />
              <span
                v-if="messagesPerField.existsError('userLabel')"
                id="input-error-otp-label"
                :class="kcClsx('kcInputErrorMessageClass')"
                aria-live="polite"
                v-html="kcSanitize(messagesPerField.get('userLabel'))"
              />
            </div>
          </div>

          <!-- Submit/Cancel buttons -->
          <div
            id="kc-form-buttons"
            :class="clsx(kcClsx('kcFormGroupClass'), 'text-right')"
          >
            <div :class="kcClsx('kcInputWrapperClass')">
              <input
                type="submit"
                :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')"
                id="saveTOTPBtn"
                :value="msgStr('doSave')"
              />
              <button
                type="submit"
                :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')"
                id="cancelTOTPBtn"
                name="submitAction"
                value="Cancel"
              >
                <component :is="msg('doCancel')" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </template>
  </component>
</template>
