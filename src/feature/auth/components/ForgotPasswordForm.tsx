import React, { useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { forgotPassword } from "../auth.api";

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

function validateEmail(value: string) {
    if (!value.trim()) return "Email is required";
    if (value.length > MAX_EMAIL_LENGTH) return "Email is too long";
    if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address";
    return "";
}

// ---------------------------------------------------------------------------
// Mock backend call — swap this out for your real API call later.
// Resolves after a short delay; randomly rejects ~20% of the time
// (simulating e.g. "no account with that email") so you can exercise the
// error-banner UI during development.
// ---------------------------------------------------------------------------
function simulateForgotPasswordRequest({
    email,
}: {
    email: string;
}) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const shouldFail = Math.random() < 0.2;
            if (shouldFail) {
                reject(new Error("We couldn't find an account with that email."));
            } else {
                resolve({ email });
            }
        }, 1400);
    });
}

const RESEND_COOLDOWN_SECONDS = 30;

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [focused, setFocused] = useState(false);

    const [touched, setTouched] = useState(false);
    const [error, setError] = useState<string>("");
    const [formError, setFormError] = useState<string>("");
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Once the link is sent, we swap the form for a confirmation state
    // (rather than a popup) — this is the more standard pattern for
    // "reset link sent" flows since the person needs to go check their
    // inbox, not just dismiss a modal and move on.
    const [linkSent, setLinkSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const cooldownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    const hasError = !!error && (touched || submitAttempted);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (touched || submitAttempted) {
            setError(validateEmail(value));
        }
        if (formError) setFormError("");
    };

    const handleBlur = () => {
        setFocused(false);
        setTouched(true);
        setError(validateEmail(email));
    };

    const startCooldown = () => {
        setCooldown(RESEND_COOLDOWN_SECONDS);
        if (cooldownInterval.current) {
            clearInterval(cooldownInterval.current);
        }
        cooldownInterval.current = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(cooldownInterval.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendResetLink = async () => {
        setSubmitAttempted(true);
        Keyboard.dismiss();

        const emailError = validateEmail(email);
        setError(emailError);
        setTouched(true);
        if (emailError) return;

        setIsSubmitting(true);
        setFormError("");

        try {
            await forgotPassword(email);
            setLinkSent(true);
            startCooldown();
        } catch (err) {
            if (err instanceof Error) {
                setFormError(err.message);
            } else {
                if (err instanceof Error) {
                    setFormError(err.message);
                } else {
                    setFormError("Something went wrong. Please try again.");
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0 || isSubmitting) return;
        setIsSubmitting(true);
        setFormError("");
        try {
            await forgotPassword(email);
            startCooldown();
        } catch (err) {
            if (err instanceof Error) {
                setFormError(err.message);
            } else {
                setFormError("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUseDifferentEmail = () => {
        setLinkSent(false);
        setEmail("");
        setTouched(false);
        setSubmitAttempted(false);
        setError("");
        setFormError("");
        setCooldown(0);
        if (cooldownInterval.current) clearInterval(cooldownInterval.current);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* BACK BUTTON */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.card}>
                    {!linkSent ? (
                        <>
                            {/* ICON */}
                            <View style={styles.iconWrapper}>
                                <View style={styles.iconSquare}>
                                    <Ionicons
                                        name="shield-checkmark"
                                        size={36}
                                        color="#84CC16"
                                    />
                                </View>
                                <View style={styles.iconBadge}>
                                    <Ionicons
                                        name="key"
                                        size={14}
                                        color="#0B1110"
                                    />
                                </View>
                            </View>

                            <Text style={styles.title}>Forgot Password?</Text>
                            <Text style={styles.subtitle}>
                                Enter your email address and we'll send you a
                                secure link to reset your password.
                            </Text>

                            {/* FORM-LEVEL ERROR BANNER */}
                            {formError ? (
                                <View style={styles.formErrorBanner}>
                                    <Ionicons
                                        name="alert-circle"
                                        size={18}
                                        color="#F87171"
                                    />
                                    <Text style={styles.formErrorBannerText}>
                                        {formError}
                                    </Text>
                                </View>
                            ) : null}

                            <Text style={styles.label}>Email Address</Text>

                            <View
                                style={[
                                    styles.inputContainer,
                                    focused && styles.inputFocused,
                                    hasError && styles.inputError,
                                ]}
                            >
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={
                                        hasError
                                            ? "#F87171"
                                            : "rgba(255,255,255,0.65)"
                                    }
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="name@example.com"
                                    placeholderTextColor="rgba(255,255,255,0.35)"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={email}
                                    onChangeText={handleEmailChange}
                                    onFocus={() => setFocused(true)}
                                    onBlur={handleBlur}
                                    returnKeyType="send"
                                    onSubmitEditing={handleSendResetLink}
                                    editable={!isSubmitting}
                                />

                                {hasError && (
                                    <Ionicons
                                        name="alert-circle"
                                        size={18}
                                        color="#F87171"
                                    />
                                )}
                            </View>
                            {hasError ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : (
                                <View style={styles.errorSpacer} />
                            )}

                            {/* CTA */}
                            <TouchableOpacity
                                style={[
                                    styles.primaryButton,
                                    isSubmitting && styles.primaryButtonDisabled,
                                ]}
                                onPress={handleSendResetLink}
                                disabled={isSubmitting}
                                activeOpacity={0.85}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#0B1110" />
                                ) : (
                                    <Text style={styles.primaryButtonText}>
                                        Send Reset Link
                                    </Text>
                                )}
                            </TouchableOpacity>

                            {/* SUPPORT */}
                            <TouchableOpacity
                                style={styles.supportRow}
                                disabled={isSubmitting}
                            >
                                <Ionicons
                                    name="help-buoy-outline"
                                    size={16}
                                    color="rgba(255,255,255,0.5)"
                                />
                                <Text style={styles.supportText}>
                                    Need more help?{" "}
                                    <Text style={styles.link}>
                                        Contact Support
                                    </Text>
                                </Text>
                            </TouchableOpacity>

                            {/* FOOTER */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    Remember your password?{" "}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => router.push("/auth/login")}
                                    disabled={isSubmitting}
                                >
                                    <Text style={styles.link}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            {/* SUCCESS STATE */}
                            <View style={styles.iconWrapper}>
                                <View style={styles.iconSquareSuccess}>
                                    <Ionicons
                                        name="mail-open"
                                        size={36}
                                        color="#84CC16"
                                    />
                                </View>
                                <View style={styles.iconBadge}>
                                    <Ionicons
                                        name="checkmark"
                                        size={14}
                                        color="#0B1110"
                                    />
                                </View>
                            </View>

                            <Text style={styles.title}>Check Your Email</Text>
                            <Text style={styles.subtitle}>
                                We've sent a password reset link to{"\n"}
                                <Text style={styles.emailHighlight}>
                                    {email}
                                </Text>
                            </Text>

                            {formError ? (
                                <View style={styles.formErrorBanner}>
                                    <Ionicons
                                        name="alert-circle"
                                        size={18}
                                        color="#F87171"
                                    />
                                    <Text style={styles.formErrorBannerText}>
                                        {formError}
                                    </Text>
                                </View>
                            ) : null}

                            <View style={styles.hintBox}>
                                <Ionicons
                                    name="information-circle-outline"
                                    size={16}
                                    color="rgba(255,255,255,0.5)"
                                />
                                <Text style={styles.hintText}>
                                    Didn't get it? Check your spam folder, or
                                    resend below.
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.primaryButton,
                                    (cooldown > 0 || isSubmitting) &&
                                    styles.primaryButtonDisabled,
                                ]}
                                onPress={handleResend}
                                disabled={cooldown > 0 || isSubmitting}
                                activeOpacity={0.85}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#0B1110" />
                                ) : (
                                    <Text style={styles.primaryButtonText}>
                                        {cooldown > 0
                                            ? `Resend in ${cooldown}s`
                                            : "Resend Link"}
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={handleUseDifferentEmail}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.secondaryButtonText}>
                                    Use a different email
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    Remember your password?{" "}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => router.push("/auth/login")}
                                    disabled={isSubmitting}
                                >
                                    <Text style={styles.link}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            {/* AMBIENT GLOWS */}
            <View pointerEvents="none" style={styles.topGlow} />
            <View pointerEvents="none" style={styles.bottomGlow} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B1110",
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
        justifyContent: "center",
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#121918",
        borderWidth: 1,
        borderColor: "#26312E",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },

    card: {
        backgroundColor: "rgba(18,25,24,0.4)",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#26312E",
        paddingVertical: 36,
        paddingHorizontal: 24,
        alignItems: "center",
    },

    iconWrapper: {
        marginBottom: 24,
        position: "relative",
    },

    iconSquare: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: "rgba(132,204,22,0.12)",
        justifyContent: "center",
        alignItems: "center",
    },

    iconSquareSuccess: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: "rgba(132,204,22,0.12)",
        justifyContent: "center",
        alignItems: "center",
    },

    iconBadge: {
        position: "absolute",
        bottom: -6,
        right: -6,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "#84CC16",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#0B1110",
    },

    title: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "800",
        marginBottom: 12,
        textAlign: "center",
    },

    subtitle: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 14,
        lineHeight: 21,
        textAlign: "center",
        marginBottom: 28,
    },

    emailHighlight: {
        color: "#FFFFFF",
        fontWeight: "700",
    },

    formErrorBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(248,113,113,0.1)",
        borderWidth: 1,
        borderColor: "rgba(248,113,113,0.35)",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 20,
        gap: 10,
        width: "100%",
    },

    formErrorBannerText: {
        color: "#F87171",
        fontSize: 13,
        flex: 1,
        lineHeight: 18,
    },

    label: {
        color: "#84CC16",
        fontSize: 13,
        fontWeight: "600",
        alignSelf: "flex-start",
        marginBottom: 8,
    },

    inputContainer: {
        width: "100%",
        height: 56,
        backgroundColor: "#121918",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#26312E",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        gap: 10,
    },

    inputFocused: {
        borderColor: "#84CC16",
    },

    inputError: {
        borderColor: "#F87171",
    },

    input: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 15,
    },

    errorText: {
        color: "#F87171",
        fontSize: 12,
        marginTop: 6,
        alignSelf: "flex-start",
    },

    errorSpacer: {
        height: 18,
    },

    primaryButton: {
        width: "100%",
        height: 56,
        backgroundColor: "#84CC16",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,

        shadowColor: "#84CC16",
        shadowOpacity: 0.25,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },

    primaryButtonDisabled: {
        opacity: 0.6,
    },

    primaryButtonText: {
        color: "#0B1110",
        fontSize: 16,
        fontWeight: "700",
    },

    secondaryButton: {
        width: "100%",
        height: 52,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#26312E",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
    },

    secondaryButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },

    hintBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#121918",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#26312E",
        padding: 12,
        gap: 8,
        marginBottom: 8,
        width: "100%",
    },

    hintText: {
        color: "rgba(255,255,255,0.55)",
        fontSize: 12,
        lineHeight: 17,
        flex: 1,
    },

    supportRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 20,
    },

    supportText: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 13,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },

    footerText: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 13,
    },

    link: {
        color: "#84CC16",
        fontWeight: "600",
        fontSize: 13,
    },

    topGlow: {
        position: "absolute",
        top: -120,
        alignSelf: "center",
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: "rgba(132,204,22,0.08)",
    },

    bottomGlow: {
        position: "absolute",
        bottom: -150,
        alignSelf: "center",
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: "rgba(15,118,110,0.10)",
    },
});