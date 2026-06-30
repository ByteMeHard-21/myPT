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
    Image,
    Modal,
    ActivityIndicator,
    Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";

import { signUp } from "../auth.api";
import { useAuthStore } from "../../../store/authStore";

const { height } = Dimensions.get("window");

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 16; // example hard cap — adjust to your backend's real limit

type SignupRequest = {
    email: string;
    password: string;
};

function validateEmail(value: string) {
    if (!value.trim()) return "Email is required";
    if (value.length > MAX_EMAIL_LENGTH) return "Email is too long";
    if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address";
    return "";
}

function validatePassword(value: string) {
    if (!value) return "Password is required";
    if (value.length < MIN_PASSWORD_LENGTH) {
        return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    if (value.length > MAX_PASSWORD_LENGTH) {
        return `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer`;
    }
    if (!/[0-9]/.test(value)) return "Password must include at least one number";
    if (!/[A-Z]/.test(value)) return "Password must include one uppercase letter";
    return "";
}

function getPasswordStrength(value: string) {
    if (!value) return { label: "", score: 0 };
    let score = 0;
    if (value.length >= MIN_PASSWORD_LENGTH) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    if (score <= 1) return { label: "Weak", score, color: "#F87171" };
    if (score <= 2) return { label: "Fair", score, color: "#FBBF24" };
    if (score === 3) return { label: "Good", score, color: "#84CC16" };
    return { label: "Strong", score, color: "#22C55E" };
}

// ---------------------------------------------------------------------------
// Mock backend call — swap this out for your real API call later.
// Resolves after a short delay; randomly rejects ~20% of the time (simulating
// e.g. "email already in use") so you can exercise the error-banner UI.
// ---------------------------------------------------------------------------
function simulateSignupRequest({ email, password }: SignupRequest) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const shouldFail = Math.random() < 0.2;
            if (shouldFail) {
                reject(new Error("An account with this email already exists."));
            } else {
                resolve({ email });
            }
        }, 1400);
    });
}

export default function SignupScreen() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [secureText, setSecureText] = useState(true);
    const [focusedInput, setFocusedInput] = useState("");
    const [agreed, setAgreed] = useState(false);

    const [touched, setTouched] = useState({ email: false, password: false });
    const [errors, setErrors] = useState({ email: "", password: "", terms: "" });
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const passwordInputRef = useRef<TextInput | null>(null);
    const strength = getPasswordStrength(password);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (touched.email || submitAttempted) {
            setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
        }
        if (formError) setFormError("");
    };

    const handlePasswordChange = (value: string) => {
        // Hard-stop typing past the max length so the field itself can never
        // exceed the limit — this is what prevents the "15 vs 16 chars" case
        // from ever being submittable in the first place.
        if (value.length > MAX_PASSWORD_LENGTH) return;

        setPassword(value);
        if (touched.password || submitAttempted) {
            setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
        }
        if (formError) setFormError("");
    };

    const handleEmailBlur = () => {
        setFocusedInput("");
        setTouched((prev) => ({ ...prev, email: true }));
        setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    };

    const handlePasswordBlur = () => {
        setFocusedInput("");
        setTouched((prev) => ({ ...prev, password: true }));
        setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    };

    const handleToggleAgreed = () => {
        setAgreed((prev) => !prev);
        if (errors.terms) {
            setErrors((prev) => ({ ...prev, terms: "" }));
        }
    };

    const runValidation = () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const termsError = agreed ? "" : "You must accept the Terms and Privacy Policy";

        setErrors({ email: emailError, password: passwordError, terms: termsError });
        setTouched({ email: true, password: true });

        return !emailError && !passwordError && !termsError;
    };

    const setSession = useAuthStore((s) => s.setSession);

    const handleCreateAccount = async () => {
        setSubmitAttempted(true);
        Keyboard.dismiss();

        const isValid = runValidation();
        if (!isValid) return;

        setIsSubmitting(true);
        setFormError("");

        try {
            const { data, error } = await signUp(email, password);

            if (error) {
                setFormError(error.message);
                return;
            }

            if (!data.session) {
                setFormError("Unable to create a session.");
                return;
            }

            setSession(data.session);
            setShowSuccessModal(true);
        } catch (err) {
            setFormError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessContinue = () => {
        setShowSuccessModal(false);
        router.replace("/profileSetup/userInfo");// hook up real navigation here
    };

    const emailHasError = !!errors.email && (touched.email || submitAttempted);
    const passwordHasError = !!errors.password && (touched.password || submitAttempted);
    const termsHasError = !!errors.terms && submitAttempted;

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
                {/* IMAGE SECTION */}
                <View style={styles.imageSection}>
                    <View style={styles.heroGlow} />
                    <Image
                        source={require("../../../../assets/images/auth_signup.png")}
                        style={styles.image}
                        resizeMode="contain"
                    />

                    <LinearGradient
                        colors={[
                            "transparent",
                            "rgba(11,17,16,0.3)",
                            "rgba(11,17,16,0.7)",
                            "#0B1110",
                        ]}
                        locations={[0, 0.45, 0.75, 1]}
                        style={styles.imageFade}
                    />
                </View>

                {/* CONTENT SECTION */}
                <View style={styles.contentSection}>
                    <Text style={styles.title}>Create Your Account</Text>

                    <Text style={styles.subtitle}>
                        Start training smarter with your personal AI coach.
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

                    {/* EMAIL */}
                    <View
                        style={[
                            styles.inputContainer,
                            focusedInput === "email" && styles.inputFocused,
                            emailHasError && styles.inputError,
                        ]}
                    >
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color={
                                emailHasError
                                    ? "#F87171"
                                    : "rgba(255,255,255,0.65)"
                            }
                        />
                        <TextInput
                            placeholder="name@example.com"
                            placeholderTextColor="rgba(255,255,255,0.35)"
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={email}
                            onChangeText={handleEmailChange}
                            onFocus={() => setFocusedInput("email")}
                            onBlur={handleEmailBlur}
                            returnKeyType="next"
                            onSubmitEditing={() => passwordInputRef.current?.focus()}
                            editable={!isSubmitting}
                        />
                        {emailHasError && (
                            <Ionicons name="alert-circle" size={18} color="#F87171" />
                        )}
                    </View>
                    {emailHasError ? (
                        <Text style={styles.errorText}>{errors.email}</Text>
                    ) : (
                        <View style={styles.errorSpacer} />
                    )}

                    {/* PASSWORD */}
                    <View
                        style={[
                            styles.inputContainer,
                            focusedInput === "password" && styles.inputFocused,
                            passwordHasError && styles.inputError,
                        ]}
                    >
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color={
                                passwordHasError
                                    ? "#F87171"
                                    : "rgba(255,255,255,0.65)"
                            }
                        />

                        <TextInput
                            ref={passwordInputRef}
                            placeholder="8-16 chars, 1 number, 1 uppercase"
                            placeholderTextColor="rgba(255,255,255,0.35)"
                            style={styles.input}
                            secureTextEntry={secureText}
                            value={password}
                            onChangeText={handlePasswordChange}
                            onFocus={() => setFocusedInput("password")}
                            onBlur={handlePasswordBlur}
                            maxLength={MAX_PASSWORD_LENGTH}
                            returnKeyType="done"
                            onSubmitEditing={handleCreateAccount}
                            editable={!isSubmitting}
                        />

                        <TouchableOpacity
                            onPress={() => setSecureText(!secureText)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons
                                name={secureText ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color="rgba(255,255,255,0.65)"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* PASSWORD META ROW: char counter + strength meter */}
                    <View style={styles.passwordMetaRow}>
                        {passwordHasError ? (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        ) : password.length > 0 ? (
                            <View style={styles.strengthRow}>
                                <View style={styles.strengthTrack}>
                                    <View
                                        style={[
                                            styles.strengthFill,
                                            {
                                                width: `${(strength.score / 4) * 100}%`,
                                                backgroundColor: strength.color,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.strengthLabel,
                                        { color: strength.color },
                                    ]}
                                >
                                    {strength.label}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.errorSpacer} />
                        )}

                        <Text
                            style={[
                                styles.charCounter,
                                password.length === MAX_PASSWORD_LENGTH &&
                                styles.charCounterMax,
                            ]}
                        >
                            {password.length}/{MAX_PASSWORD_LENGTH}
                        </Text>
                    </View>

                    {/* TERMS */}
                    <View style={styles.checkboxRow}>
                        <TouchableOpacity
                            style={[
                                styles.checkbox,
                                agreed && styles.checkboxChecked,
                                termsHasError && styles.checkboxError,
                            ]}
                            onPress={handleToggleAgreed}
                            activeOpacity={0.8}
                            disabled={isSubmitting}
                        >
                            {agreed && (
                                <Ionicons
                                    name="checkmark"
                                    size={12}
                                    color="#0B1110"
                                    style={styles.checkIcon}
                                />
                            )}
                        </TouchableOpacity>

                        <Text style={styles.termsText}>
                            I agree to the{" "}
                            <Text style={styles.link}>Terms of Service</Text> and{" "}
                            <Text style={styles.link}>Privacy Policy</Text>
                        </Text>
                    </View>
                    {termsHasError ? (
                        <Text style={styles.errorText}>{errors.terms}</Text>
                    ) : null}

                    {/* CTA */}
                    <TouchableOpacity
                        style={[
                            styles.primaryButton,
                            isSubmitting && styles.primaryButtonDisabled,
                        ]}
                        onPress={handleCreateAccount}
                        disabled={isSubmitting}
                        activeOpacity={0.85}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#0B1110" />
                        ) : (
                            <>
                                <Text style={styles.primaryButtonText}>
                                    Create Account
                                </Text>
                                <Ionicons
                                    name="arrow-forward"
                                    size={18}
                                    color="#0B1110"
                                />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* DIVIDER */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>
                            OR CONTINUE WITH
                        </Text>
                        <View style={styles.divider} />
                    </View>

                    {/* SOCIAL */}
                    <View style={styles.socialRow}>
                        <TouchableOpacity
                            style={styles.socialButton}
                            disabled={isSubmitting}
                        >
                            <Ionicons name="logo-google" size={20} color="#fff" />
                            <Text style={styles.socialText}>Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.socialButton}
                            disabled={isSubmitting}
                        >
                            <Ionicons name="logo-apple" size={20} color="#fff" />
                            <Text style={styles.socialText}>Apple</Text>
                        </TouchableOpacity>
                    </View>

                    {/* FOOTER */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Already have an account?{" "}
                        </Text>

                        <TouchableOpacity
                            onPress={() => router.push("/auth/login")}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.link}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* AMBIENT GLOWS */}
            <View pointerEvents="none" style={styles.topGlow} />
            <View pointerEvents="none" style={styles.bottomGlow} />

            {/* SUCCESS MODAL */}
            <Modal
                visible={showSuccessModal}
                transparent
                animationType="fade"
                onRequestClose={handleSuccessContinue}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalIconCircle}>
                            <Ionicons
                                name="checkmark-circle"
                                size={48}
                                color="#84CC16"
                            />
                        </View>

                        <Text style={styles.modalTitle}>Account created!</Text>
                        <Text style={styles.modalSubtitle}>
                            Welcome aboard — your account is ready to go.
                        </Text>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleSuccessContinue}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.modalButtonText}>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    },

    imageSection: {
        height: height * 0.42,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },

    image: {
        width: "100%",
        height: "100%",
    },

    imageFade: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 140,
    },
    heroGlow: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: "rgba(132,204,22,0.12)",
        top: 20,
    },

    contentSection: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    title: {
        color: "#FFF",
        fontSize: 32,
        fontWeight: "800",
        marginBottom: 10,
    },

    subtitle: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 24,
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
        marginBottom: 16,
        gap: 10,
    },

    formErrorBannerText: {
        color: "#F87171",
        fontSize: 13,
        flex: 1,
        lineHeight: 18,
    },

    inputContainer: {
        height: 56,
        backgroundColor: "#121918",
        borderWidth: 1,
        borderColor: "#26312E",
        borderRadius: 16,
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
        color: "#FFF",
        fontSize: 15,
    },

    errorText: {
        color: "#F87171",
        fontSize: 12,
        marginTop: 6,
        lineHeight: 16,
    },

    errorSpacer: {
        height: 16,
    },

    passwordMetaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
    },

    strengthRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        flex: 1,
        gap: 8,
    },

    strengthTrack: {
        width: 80,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#26312E",
        overflow: "hidden",
    },

    strengthFill: {
        height: 4,
        borderRadius: 2,
    },

    strengthLabel: {
        fontSize: 11,
        fontWeight: "600",
    },

    charCounter: {
        color: "rgba(255,255,255,0.35)",
        fontSize: 11,
        marginTop: 6,
    },

    charCounterMax: {
        color: "#FBBF24",
    },

    checkboxRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 4,
    },

    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: "#26312E",
        backgroundColor: "#121918",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        marginTop: 2,
    },

    checkboxChecked: {
        backgroundColor: "#84CC16",
        borderColor: "#84CC16",
    },

    checkboxError: {
        borderColor: "#F87171",
    },

    checkIcon: {
        fontWeight: "900",
    },

    termsText: {
        flex: 1,
        color: "rgba(255,255,255,0.65)",
        fontSize: 12,
        lineHeight: 18,
    },

    primaryButton: {
        marginTop: 20,
        height: 56,
        backgroundColor: "#84CC16",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    primaryButtonDisabled: {
        opacity: 0.6,
    },

    primaryButtonText: {
        color: "#0B1110",
        fontWeight: "700",
        fontSize: 16,
        marginRight: 8,
    },

    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 28,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#26312E",
    },

    dividerText: {
        color: "rgba(255,255,255,0.4)",
        marginHorizontal: 12,
        fontSize: 11,
    },

    socialRow: {
        flexDirection: "row",
        gap: 12,
    },

    socialButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#26312E",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    socialText: {
        color: "#FFF",
        marginLeft: 8,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 28,
    },

    footerText: {
        color: "rgba(255,255,255,0.65)",
    },

    link: {
        color: "#84CC16",
        fontWeight: "600",
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

    // --- Modal ---
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.65)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },

    modalCard: {
        width: "100%",
        backgroundColor: "#121918",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#26312E",
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: "center",
    },

    modalIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(132,204,22,0.12)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },

    modalTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
    },

    modalSubtitle: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 20,
    },

    modalButton: {
        width: "100%",
        height: 52,
        backgroundColor: "#84CC16",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },

    modalButtonText: {
        color: "#0B1110",
        fontSize: 15,
        fontWeight: "700",
    },
});