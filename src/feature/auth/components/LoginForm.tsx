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
import { signIn } from "../auth.api";
import { useAuthStore } from "../../../store/authStore";

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type SignupRequest = {
    email: string;
    password: string;
};

function validateEmail(value: string) {
    if (!value.trim()) return "Email is required";
    if (value.length > 254) return "Email is too long";
    if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address";
    return "";
}

function validatePassword(value: string) {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (value.length > 64) return "Password must be under 64 characters";
    return "";
}

// ---------------------------------------------------------------------------
// Mock backend call — swap this out for your real API call later.
// Resolves after a short delay; randomly rejects ~20% of the time so you
// can exercise the error-banner UI during development.
// ---------------------------------------------------------------------------
function simulateLoginRequest({ email, password }: SignupRequest) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const shouldFail = Math.random() < 0.2;
            if (shouldFail) {
                reject(new Error("Invalid email or password. Please try again."));
            } else {
                resolve({ email });
            }
        }, 1400);
    });
}

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secureText, setSecureText] = useState(true);
    const [focusedInput, setFocusedInput] = useState("");

    // touched: only show field errors after the user has interacted with
    // (blurred) a field, or after a submit attempt — avoids yelling at
    // someone the instant they land on the screen.
    const [touched, setTouched] = useState({ email: false, password: false });
    const [errors, setErrors] = useState({ email: "", password: "" });

    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const passwordInputRef = useRef<TextInput | null>(null);
    const setSession = useAuthStore((s) => s.setSession);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (touched.email || submitAttempted) {
            setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
        }
        if (formError) setFormError("");
    };

    const handlePasswordChange = (value: string) => {
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

    const runValidation = () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        setErrors({ email: emailError, password: passwordError });
        setTouched({ email: true, password: true });
        return !emailError && !passwordError;
    };

    const handleSignIn = async () => {
        setSubmitAttempted(true);
        Keyboard.dismiss();

        const isValid = runValidation();
        if (!isValid) return;

        setIsSubmitting(true);
        setFormError("");

        try {
            const { data, error } = await signIn(email, password);

            if (error) {
                setFormError(error.message);
                return;
            }

            if (!data.session) {
                setFormError("Unable to create a session.");
                return;
            }

            setSession(data.session); // optional (listener also handles it)


            setShowSuccessModal(true);
        } catch (err) {
            setFormError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessContinue = () => {
        setShowSuccessModal(false);
        router.replace("/tabs/workout");
    };

    const emailHasError = !!errors.email && (touched.email || submitAttempted);
    const passwordHasError = !!errors.password && (touched.password || submitAttempted);

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
                    <Image
                        source={require("../../../../assets/images/auth_login.png")}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                {/* CONTENT SECTION */}
                <View style={styles.contentSection}>
                    <Text style={styles.title}>Welcome Back</Text>

                    <Text style={styles.subtitle}>
                        Continue your fitness journey.
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
                            style={styles.input}
                            placeholder="name@example.com"
                            placeholderTextColor="rgba(255,255,255,0.35)"
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
                            <Ionicons
                                name="alert-circle"
                                size={18}
                                color="#F87171"
                            />
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
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor="rgba(255,255,255,0.35)"
                            secureTextEntry={secureText}
                            value={password}
                            onChangeText={handlePasswordChange}
                            onFocus={() => setFocusedInput("password")}
                            onBlur={handlePasswordBlur}
                            returnKeyType="done"
                            onSubmitEditing={handleSignIn}
                            editable={!isSubmitting}
                        />

                        <TouchableOpacity
                            onPress={() => setSecureText(!secureText)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons
                                name={
                                    secureText
                                        ? "eye-outline"
                                        : "eye-off-outline"
                                }
                                size={20}
                                color="rgba(255,255,255,0.65)"
                            />
                        </TouchableOpacity>
                    </View>
                    {passwordHasError ? (
                        <Text style={styles.errorText}>{errors.password}</Text>
                    ) : (
                        <View style={styles.errorSpacer} />
                    )}

                    {/* FORGOT PASSWORD */}
                    <TouchableOpacity
                        style={styles.forgotContainer}
                        disabled={isSubmitting}
                        onPress={() => router.push("/auth/forget_pass")}
                    >
                        <Text style={styles.forgotText}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    {/* SIGN IN BUTTON */}
                    <TouchableOpacity
                        style={[
                            styles.primaryButton,
                            isSubmitting && styles.primaryButtonDisabled,
                        ]}
                        onPress={handleSignIn}
                        disabled={isSubmitting}
                        activeOpacity={0.85}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#0B1110" />
                        ) : (
                            <>
                                <Text style={styles.primaryButtonText}>
                                    Sign In
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

                    {/* SOCIAL BUTTONS */}
                    <View style={styles.socialRow}>
                        <TouchableOpacity
                            style={styles.socialButton}
                            disabled={isSubmitting}
                        >
                            <Ionicons
                                name="logo-google"
                                size={20}
                                color="#FFFFFF"
                            />

                            <Text style={styles.socialText}>
                                Google
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.socialButton}
                            disabled={isSubmitting}
                        >
                            <Ionicons
                                name="logo-apple"
                                size={20}
                                color="#FFFFFF"
                            />

                            <Text style={styles.socialText}>
                                Apple
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* FOOTER */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Don't have an account?
                        </Text>

                        <TouchableOpacity
                            onPress={() => router.push("/auth/signup")}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.link}>
                                {" "}
                                Create Account
                            </Text>
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

                        <Text style={styles.modalTitle}>Welcome back!</Text>
                        <Text style={styles.modalSubtitle}>
                            You've successfully signed in.
                        </Text>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleSuccessContinue}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.modalButtonText}>Continue</Text>
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
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
    },

    image: {
        width: "92%",
        height: "100%",
    },

    contentSection: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 34,
        fontWeight: "800",
        marginBottom: 10,
    },

    subtitle: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 16,
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
        marginBottom: 10,
        marginLeft: 4,
    },

    errorSpacer: {
        height: 16,
        marginTop: 6,
    },

    forgotContainer: {
        alignSelf: "flex-end",
        marginBottom: 24,
    },

    forgotText: {
        color: "#84CC16",
        fontSize: 13,
        fontWeight: "500",
    },

    primaryButton: {
        height: 56,
        backgroundColor: "#84CC16",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",

        shadowColor: "#84CC16",
        shadowOpacity: 0.25,
        shadowRadius: 16,
        shadowOffset: {
            width: 0,
            height: 6,
        },

        elevation: 8,
    },

    primaryButtonDisabled: {
        opacity: 0.6,
    },

    primaryButtonText: {
        color: "#0B1110",
        fontSize: 16,
        fontWeight: "700",
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
        fontSize: 11,
        marginHorizontal: 12,
        letterSpacing: 1,
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
        backgroundColor: "#121918",

        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    socialText: {
        color: "#FFFFFF",
        marginLeft: 8,
        fontSize: 15,
        fontWeight: "500",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 32,
    },

    footerText: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 14,
    },

    link: {
        color: "#84CC16",
        fontWeight: "600",
        fontSize: 14,
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