FROM node:13.8.0-alpine

LABEL MAINTAINER="WED"

#ENVIRONNEMENT
ENV GIT_EMAIL="weaponizing.existential.dread@gmail.com"
ENV GIT_NAME="Existential Dread"

ENV GLIB_PACKAGE_BASE_URL "https://github.com/sgerrand/alpine-pkg-glibc/releases/download"
ENV GLIB_VERSION "2.30-r0"

ENV JAVA_HOME "/usr/lib/jvm/java-1.8-openjdk"

ENV GRADLE_HOME "/usr/local/gradle"
ENV GRADLE_VERSION "6.1"

ENV ANDROID_HOME "/usr/local/android-sdk-linux"
ENV ANDROID_SDK_TOOLS_VERSION "4333796"
ENV ANDROID_BUILD_TOOLS_VERSION "29.0.3"
ENV ANDROID_API_LEVELS "android-29"

ENV IONIC_VERSION "6.1.0"

ENV PATH ${GRADLE_HOME}/bin:${JAVA_HOME}/bin:${ANDROID_HOME}/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH

# Install basic dependencies
RUN apk add --no-cache bash git unzip curl && \
    apk add --virtual .rundeps $runDeps

# Configure git
RUN git config --global user.email "${GIT_EMAIL}"
RUN git config --global user.name "${GIT_NAME}"

# Install Java
RUN apk add openjdk8-jre openjdk8

# INSTALL GLIBC
RUN curl -L https://raw.githubusercontent.com/wassim6/alpine-pkg-glibc/master/sgerrand.rsa.pub > /etc/apk/keys/sgerrand.rsa.pub && \
  curl -L ${GLIB_PACKAGE_BASE_URL}/${GLIB_VERSION}/glibc-${GLIB_VERSION}.apk > /tmp/glibc.apk && \
  curl -L ${GLIB_PACKAGE_BASE_URL}/${GLIB_VERSION}/glibc-bin-${GLIB_VERSION}.apk > /tmp/glibc-bin.apk && \
  apk add /tmp/glibc-bin.apk /tmp/glibc.apk

# Install Ionic
RUN npm install -g @ionic/cli@${IONIC_VERSION}

# Install Gradle
RUN mkdir -p ${GRADLE_HOME} && \
  curl -L https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip > /tmp/gradle.zip && \
  unzip /tmp/gradle.zip -d ${GRADLE_HOME} && \
  mv ${GRADLE_HOME}/gradle-${GRADLE_VERSION}/* ${GRADLE_HOME} && \
  rm -r ${GRADLE_HOME}/gradle-${GRADLE_VERSION}/

# Download and extract Android Tools
RUN curl -L https://dl.google.com/android/repository/sdk-tools-linux-${ANDROID_SDK_TOOLS_VERSION}.zip > /tmp/tools.zip && \
    mkdir -p ${ANDROID_HOME} && \
    unzip -qq /tmp/tools.zip -d ${ANDROID_HOME} && \
    rm -v /tmp/tools.zip

# Install Android SDK Packages
RUN mkdir -p ~/.android/ && touch ~/.android/repositories.cfg && \
    yes | ${ANDROID_HOME}/tools/bin/sdkmanager "--licenses" && \
    ${ANDROID_HOME}/tools/bin/sdkmanager "platform-tools" "extras;android;m2repository" "extras;google;m2repository" "extras;google;instantapps" && \    
    ${ANDROID_HOME}/tools/bin/sdkmanager "--update"

RUN ${ANDROID_HOME}/tools/bin/sdkmanager "build-tools;${ANDROID_BUILD_TOOLS_VERSION}" 


RUN \
  for i in ${ANDROID_API_LEVELS}; do ${ANDROID_HOME}/tools/bin/sdkmanager "platforms;$i"; done

# Clean tmp and cache files
RUN rm -rf /tmp/* /var/cache/apk/*

WORKDIR /project

EXPOSE 8100

# CMD ["npm", "install"]
CMD ["ionic", "serve", "--external"]